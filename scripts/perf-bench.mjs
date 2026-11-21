#!/usr/bin/env node
/*
 * Bench de performance reproductible (outil de perf local, voir app/6.DEV-PERF.md).
 *
 * Visite des pages plusieurs fois dans un navigateur sans interface (Chrome ou
 * Edge installé), laisse l'instrumentation de l'application mesurer chaque
 * visite (appels API, SQL, sections, Web Vitals), puis écrit les mesures dans
 * un fichier JSON à importer dans /dev/perf, onglet « Comparaison ».
 *
 * Prérequis : serveur lancé avec NEXT_PUBLIC_DEV_PERF=true (de préférence
 * `npm run build && npm run start`, sans les biais du mode dev).
 *
 * Usage :
 *   npm run perf:bench -- [--base http://127.0.0.1:3000] [--runs 3] [--cold]
 *                         [--pages /,/groupes,/groupes/RN] [--wait 8000]
 *                         [--label "avant cache"] [--out perf-results/x.json]
 *                         [--browser "C:/…/msedge.exe"]   (ou variable PERF_BROWSER)
 *
 *   --cold : vide le cache serveur avant le premier passage (1er passage à froid).
 *   --keep : ne vide pas les mesures déjà en mémoire (par défaut, le bench part de zéro).
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const DEFAULT_PAGES = ["/", "/deputydex", "/groupes", "/scrutins", "/statistics"];

function parseArgs(argv) {
    const args = { base: "http://127.0.0.1:3000", runs: 3, cold: false, keep: false, pages: DEFAULT_PAGES, wait: 8000, label: null, out: null, browser: null };
    for (let i = 0; i < argv.length; i++) {
        const [key, value] = [argv[i], argv[i + 1]];
        if (key === "--cold") args.cold = true;
        else if (key === "--keep") args.keep = true;
        else if (key === "--base") { args.base = value.replace(/\/$/, ""); i++; }
        else if (key === "--runs") { args.runs = Math.max(1, Number(value)); i++; }
        else if (key === "--pages") { args.pages = value.split(",").map((p) => p.trim()).filter(Boolean); i++; }
        else if (key === "--wait") { args.wait = Number(value); i++; }
        else if (key === "--label") { args.label = value; i++; }
        else if (key === "--out") { args.out = value; i++; }
        else if (key === "--browser") { args.browser = value; i++; }
        else throw new Error(`Option inconnue : ${key}`);
    }
    return args;
}

function findBrowser(explicit) {
    const candidates = [
        explicit,
        process.env.PERF_BROWSER,
        "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
        "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
        process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/usr/bin/microsoft-edge",
    ].filter(Boolean);
    const found = candidates.find((p) => existsSync(p));
    if (!found) throw new Error("Aucun Chrome / Edge trouvé : passe --browser <chemin> ou définis PERF_BROWSER.");
    return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDevTools(port) {
    for (let i = 0; i < 50; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${port}/json/version`);
            if (res.ok) return;
        } catch { /* pas encore prêt */ }
        await sleep(200);
    }
    throw new Error("Le navigateur sans interface n'a pas démarré.");
}

/** Client minimal du protocole DevTools : un onglet, des commandes. */
async function openTab(port) {
    const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.onmessage = (e) => {
        const m = JSON.parse(e.data);
        if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    };
    await new Promise((r, reject) => { ws.onopen = r; ws.onerror = reject; });
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    return { send, close: () => ws.close() };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const api = `${args.base}/api/dev/perf`;

    const probe = await fetch(api).catch(() => null);
    if (!probe || !probe.ok) {
        throw new Error(`${api} ne répond pas : serveur lancé ? NEXT_PUBLIC_DEV_PERF=true ? (statut : ${probe?.status ?? "injoignable"})`);
    }

    // Mesures en mémoire vidées pour partir de zéro, sauf --keep (le résultat contiendra aussi les mesures déjà là).
    if (!args.keep) await fetch(api, { method: "DELETE" });
    if (args.cold) await fetch(`${api}/cache`, { method: "DELETE" });

    const browserPath = findBrowser(args.browser);
    const port = 9300 + Math.floor(Math.random() * 500);
    const profile = mkdtempSync(join(tmpdir(), "perf-bench-"));
    const browser = spawn(browserPath, [
        "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
        `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--window-size=1400,1000", "about:blank",
    ], { stdio: "ignore" });

    try {
        await waitForDevTools(port);
        const tab = await openTab(port);
        await tab.send("Page.enable");
        await tab.send("Network.enable");
        // Pas de cache HTTP du navigateur : chaque passage refait ses appels.
        await tab.send("Network.setCacheDisabled", { cacheDisabled: true });

        for (let run = 1; run <= args.runs; run++) {
            for (const path of args.pages) {
                await tab.send("Page.navigate", { url: `${args.base}${path}` });
                await sleep(args.wait);
                console.log(`passage ${run}/${args.runs} · ${path}`);
            }
        }
        // Quitter la dernière page envoie ses dernières mesures (CLS, INP).
        await tab.send("Page.navigate", { url: "about:blank" });
        await sleep(1500);
        tab.close();
    } finally {
        browser.kill();
        await sleep(500);
        rmSync(profile, { recursive: true, force: true });
    }

    const snapshot = await (await fetch(api)).json();
    const createdAt = new Date().toISOString();
    const label = args.label ?? `bench ${args.runs} passages${args.cold ? " (1er à froid)" : ""}`;
    const out = args.out ?? join("perf-results", `perf-bench-${createdAt.slice(0, 19).replace(/[:T]/g, "-")}.json`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ kind: "deputydex-perf-bench", label, createdAt, base: args.base, runs: args.runs, pages: args.pages, snapshot }, null, 2));

    console.log(`\n${snapshot.apiCalls.length} appels API et ${snapshot.client.length} mesures navigateur enregistrés.`);
    console.log(`Résultat : ${out} — à importer dans /dev/perf, onglet « Comparaison ».`);
}

main().catch((e) => {
    console.error(`perf:bench : ${e.message}`);
    process.exit(1);
});

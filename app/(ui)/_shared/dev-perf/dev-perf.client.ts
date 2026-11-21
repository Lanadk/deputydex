"use client";

import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";
import { ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";

/*
 * Outil de perf, côté navigateur (dev seulement, voir app/6.DEV-PERF.md) :
 * - chaque `fetch` vers /api/ est chronométré (avec l'en-tête Server-Timing reçu) ;
 * - chaque section du moteur de sections est chronométrée (`measureSection`).
 * Les mesures sont envoyées par lots à /api/dev/perf, lues par la page /dev/perf.
 *
 * Une « visite » = une page (chemin). Elle commence à la première mesure faite
 * sur ce chemin ; au chargement complet d'une page, au début de la navigation.
 */

const ENDPOINT = "/api/dev/perf";
const FLUSH_DELAY_MS = 400;

let visit: { id: string; path: string; start: number } | null = null;
let queue: ClientPerfRecord[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let originalFetch: typeof fetch | null = null;

/** La page de perf elle-même n'est pas mesurée (elle se rafraîchit en boucle). */
function isIgnoredPath(path: string) {
    return path.startsWith("/dev/perf");
}

function currentVisit() {
    const path = window.location.pathname;
    if (!visit || visit.path !== path) {
        visit = {
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
            path,
            // Premier chargement : origine = début de la navigation ; navigation côté client : maintenant.
            start: visit === null ? 0 : performance.now(),
        };
    }
    return visit;
}

function enqueue(record: ClientPerfRecord) {
    queue.push(record);
    if (flushTimer) return;
    flushTimer = setTimeout(() => {
        flushTimer = null;
        const batch = queue;
        queue = [];
        (originalFetch ?? fetch)(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batch),
            keepalive: true,
        }).catch(() => { /* outil de dev : une mesure perdue n'est pas grave */ });
    }, FLUSH_DELAY_MS);
}

function installFetchMeasure() {
    if (originalFetch) return;
    originalFetch = window.fetch.bind(window);
    const base = originalFetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url, window.location.href);
        const measured = url.origin === window.location.origin
            && url.pathname.startsWith("/api/")
            && !url.pathname.startsWith(ENDPOINT)
            && !isIgnoredPath(window.location.pathname);
        if (!measured) return base(input, init);

        const v = currentVisit();
        const start = performance.now();
        const response = await base(input, init);
        enqueue({
            kind: "fetch",
            at: Date.now(),
            visitId: v.id,
            path: v.path,
            url: url.pathname + url.search,
            startMs: start - v.start,
            durationMs: performance.now() - start,
            status: response.status,
            serverTiming: response.headers.get("Server-Timing"),
        });
        return response;
    };
}

if (DEV_PERF_ENABLED && typeof window !== "undefined") installFetchMeasure();

/**
 * Chronomètre le chargement des données d'une section (son `gatewayFn`).
 * Sans l'outil de perf, renvoie `gatewayFn` tel quel.
 */
export function measureSection<P, R>(sectionId: string, gatewayFn: (params: P) => Promise<R>): (params: P) => Promise<R> {
    if (!DEV_PERF_ENABLED) return gatewayFn;
    return async (params: P) => {
        if (isIgnoredPath(window.location.pathname)) return gatewayFn(params);
        const v = currentVisit();
        const start = performance.now();
        let ok = false;
        try {
            const data = await gatewayFn(params);
            ok = true;
            return data;
        } finally {
            enqueue({
                kind: "section",
                at: Date.now(),
                visitId: v.id,
                path: v.path,
                sectionId,
                startMs: start - v.start,
                durationMs: performance.now() - start,
                ok,
            });
        }
    };
}

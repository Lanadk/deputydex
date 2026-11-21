import {
    ApiCallRecord,
    ClientFetchRecord,
    ClientPerfRecord,
    SectionTimingRecord,
} from "@/app/_shared/dev-perf/dev-perf.types";
import { parseServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";

/*
 * Calculs de la page /dev/perf, à partir des mesures brutes (voir app/6.DEV-PERF.md).
 * Fonctions pures : testées sans serveur ni navigateur.
 */

// ── Nommage des requêtes ──────────────────────────────────────────────────

/**
 * « Requête » mesurée, tirée des `keyParts` de `cachedResult` : leur premier
 * élément nomme l'endpoint (ex. "groupe-cohesion"), le reste ce sont ses
 * paramètres. Exception : la route unique des stats (`["stat", domaine, id, …]`),
 * où domaine et id font partie du nom.
 */
export function endpointFamily(keyParts: string[]): string {
    if (keyParts[0] === "stat") return keyParts.slice(0, 3).join("/");
    return keyParts[0] ?? "inconnu";
}

const DOMAIN_BY_PREFIX: Record<string, string> = {
    depute: "deputes", deputes: "deputes", deputies: "acteurs", acteur: "acteurs",
    groupe: "groupes", groupes: "groupes",
    scrutin: "scrutins", scrutins: "scrutins",
    legislature: "legislatures", legislatures: "legislatures",
    datasets: "datasets", stat: "statistics",
};

/** Domaine d'une requête (préfixe de son nom : "groupe-cohesion" → "groupes"). */
export function endpointDomain(family: string): string {
    const prefix = family.split(/[-/]/)[0];
    return DOMAIN_BY_PREFIX[prefix] ?? "autres";
}

/** Requête indiquée dans l'en-tête Server-Timing (`endpoint;desc="…"`) d'un fetch du navigateur. */
export function fetchFamily(record: ClientFetchRecord): string | null {
    return record.serverTiming ? /endpoint;desc="([^"]+)"/.exec(record.serverTiming)?.[1] ?? null : null;
}

// ── Statistiques ──────────────────────────────────────────────────────────

/** Percentile `p` (0–100) d'une liste de durées, méthode du rang le plus proche ; 0 si vide. */
export function percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.ceil((p / 100) * sorted.length);
    return sorted[Math.min(sorted.length, Math.max(1, rank)) - 1];
}

const average = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

/** Percentiles affichés dans la distribution des durées. */
export const DISTRIBUTION_PERCENTILES = [25, 50, 75, 90, 95] as const;

export type PercentileProfile = { count: number; values: Record<(typeof DISTRIBUTION_PERCENTILES)[number], number> };

/**
 * Distribution d'une série de durées : p25, p50 (médiane), p75, p90, p95.
 * Lecture : « 90 % des appels durent moins que p90 ».
 */
export function percentileProfile(values: number[]): PercentileProfile {
    return {
        count: values.length,
        values: Object.fromEntries(DISTRIBUTION_PERCENTILES.map((p) => [p, percentile(values, p)])) as PercentileProfile["values"],
    };
}

/** Durées d'une série de mesures (0 partout si la série est vide). */
export type DurationStats = { count: number; avgMs: number; p95Ms: number; maxMs: number };

export function durationStats(values: number[]): DurationStats {
    return { count: values.length, avgMs: average(values), p95Ms: percentile(values, 95), maxMs: values.length ? Math.max(...values) : 0 };
}

function groupBy<T>(list: T[], key: (item: T) => string): Map<string, T[]> {
    const groups = new Map<string, T[]>();
    for (const item of list) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
    return groups;
}

// ── Requêtes, par domaine ─────────────────────────────────────────────────

export type RequestSummary = {
    family: string;
    /** Côté serveur, tous les appels (avec ou sans cache) */
    server: DurationStats;
    /** Côté serveur, use-case exécuté (cache manquant ou désactivé), avec son SQL */
    withoutCache: DurationStats & { avgSqlMs: number; avgSqlCount: number };
    /** Côté serveur, réponse servie par le cache */
    withCache: DurationStats;
    /** Côté navigateur : durée du fetch (réseau + serveur) */
    network: DurationStats;
};

export type DomainSummary = { domain: string; requests: RequestSummary[] };

/**
 * Perf par domaine puis par requête. Les fetch du navigateur sont rattachés à
 * leur requête par l'en-tête Server-Timing. Domaines par ordre alphabétique ;
 * requêtes de la plus lente à la plus rapide, sur le p95 sans cache (le vrai
 * coût de la requête), à défaut sur le p95 serveur.
 */
export function summarizeByDomain(calls: ApiCallRecord[], client: ClientPerfRecord[]): DomainSummary[] {
    const callsByFamily = groupBy(calls, (c) => c.family);
    const networkByFamily = new Map<string, number[]>();
    for (const r of client) {
        const family = r.kind === "fetch" ? fetchFamily(r) : null;
        if (family) networkByFamily.set(family, [...(networkByFamily.get(family) ?? []), r.durationMs]);
    }

    const requests: RequestSummary[] = [...new Set([...callsByFamily.keys(), ...networkByFamily.keys()])].map((family) => {
        const list = callsByFamily.get(family) ?? [];
        const misses = list.filter((c) => !c.cacheHit);
        return {
            family,
            server: durationStats(list.map((c) => c.totalMs)),
            withoutCache: {
                ...durationStats(misses.map((c) => c.totalMs)),
                avgSqlMs: average(misses.map((c) => c.sqlMs)),
                avgSqlCount: average(misses.map((c) => c.sqlCount)),
            },
            withCache: durationStats(list.filter((c) => c.cacheHit).map((c) => c.totalMs)),
            network: durationStats(networkByFamily.get(family) ?? []),
        };
    });

    return [...groupBy(requests, (r) => endpointDomain(r.family)).entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([domain, list]) => ({
            domain,
            requests: list.sort((a, b) =>
                b.withoutCache.p95Ms - a.withoutCache.p95Ms || b.server.p95Ms - a.server.p95Ms || a.family.localeCompare(b.family)),
        }));
}

/**
 * Accélération apportée par le cache serveur sur une requête : durée moyenne
 * sans et avec cache, facteur (combien de fois plus rapide) et ms gagnées.
 * null tant qu'il manque des appels avec ou sans cache pour comparer.
 */
export function cacheSpeedup(request: RequestSummary): { withoutMs: number; withMs: number; factor: number; savedMs: number } | null {
    if (!request.withoutCache.count || !request.withCache.count) return null;
    const withoutMs = request.withoutCache.avgMs;
    const withMs = request.withCache.avgMs;
    // Plancher à 0,01 ms : une réponse du cache peut mesurer ~0 ms.
    return { withoutMs, withMs, factor: withoutMs / Math.max(withMs, 0.01), savedMs: withoutMs - withMs };
}

/**
 * Graphique d'ensemble (ms, moyennes) : une barre par domaine, `sql` + `horsSql`
 * empilés = serveur sans cache, `reseau` = durée vue du navigateur. Le serveur
 * avec cache n'y figure pas (≈ 0 ms, invisible) : voir la colonne « Accélération ».
 */
export type DomainChartRow = { label: string; sql: number; horsSql: number; reseau: number };

export function domainChartRows(domains: DomainSummary[]): DomainChartRow[] {
    return domains.map((d) => {
        const misses = d.requests.map((r) => r.withoutCache);
        const network = d.requests.map((r) => r.network);
        const missCount = misses.reduce((s, m) => s + m.count, 0);
        const netCount = network.reduce((s, n) => s + n.count, 0);
        const serverMs = missCount ? misses.reduce((s, m) => s + m.count * m.avgMs, 0) / missCount : 0;
        const sqlMs = missCount ? misses.reduce((s, m) => s + m.count * m.avgSqlMs, 0) / missCount : 0;
        const reseau = netCount ? network.reduce((s, n) => s + n.count * n.avgMs, 0) / netCount : 0;
        return { label: d.domain, sql: round1(sqlMs), horsSql: round1(Math.max(0, serverMs - sqlMs)), reseau: round1(reseau) };
    });
}

const round1 = (ms: number) => Math.round(ms * 10) / 10;

// ── Pages ─────────────────────────────────────────────────────────────────

export type PageVisit = {
    visitId: string;
    path: string;
    sections: SectionTimingRecord[];
    fetches: ClientFetchRecord[];
    /** Fin de la dernière mesure (ms depuis le début de la visite) */
    durationMs: number;
    /** Horodatage de la dernière mesure (ms depuis epoch) */
    at: number;
};

/** Toutes les visites, de la plus ancienne à la plus récente (les mesures arrivent dans l'ordre). */
function buildVisits(records: ClientPerfRecord[]): PageVisit[] {
    const visits = new Map<string, PageVisit>();
    for (const r of records) {
        const visit = visits.get(r.visitId) ?? { visitId: r.visitId, path: r.path, sections: [], fetches: [], durationMs: 0, at: 0 };
        if (r.kind === "section") visit.sections.push(r);
        else visit.fetches.push(r);
        visit.durationMs = Math.max(visit.durationMs, r.startMs + r.durationMs);
        visit.at = Math.max(visit.at, r.at ?? 0);
        visits.set(r.visitId, visit);
    }
    return [...visits.values()].map((v) => ({
        ...v,
        sections: [...v.sections].sort((a, b) => a.startMs - b.startMs),
        fetches: [...v.fetches].sort((a, b) => a.startMs - b.startMs),
    }));
}

/** Résumé d'une visite. */
export type VisitStats = {
    /** Jusqu'à la dernière donnée reçue (ms depuis le début de la visite) */
    durationMs: number;
    apiCalls: number;
    /** Appels servis par le cache serveur (d'après leur en-tête Server-Timing) */
    cachedCalls: number;
    /** Somme du temps SQL des appels (chacun mesuré côté serveur) */
    sqlMs: number;
};

export function visitStats(visit: PageVisit): VisitStats {
    const timings = visit.fetches.map((f) => parseServerTiming(f.serverTiming));
    return {
        durationMs: visit.durationMs,
        apiCalls: visit.fetches.length,
        cachedCalls: timings.filter((t) => t?.cacheHit).length,
        sqlMs: timings.reduce((sum, t) => sum + (t?.sqlMs ?? 0), 0),
    };
}

export type PageSummary = {
    path: string;
    visits: number;
    /** Durée jusqu'à la dernière donnée, toutes visites confondues */
    duration: DurationStats;
    first: VisitStats;
    last: VisitStats;
    /** Dernière visite, pour afficher sa cascade */
    lastVisit: PageVisit;
};

/**
 * Une ligne par page, toutes visites regroupées, de la plus récemment visitée
 * à la plus ancienne. Première et dernière visite : avec le cache actif, la
 * première exécute le SQL et les suivantes sont servies par le cache.
 */
export function summarizePages(records: ClientPerfRecord[]): PageSummary[] {
    return [...groupBy(buildVisits(records), (v) => v.path).entries()]
        .map(([path, visits]) => {
            const lastVisit = visits[visits.length - 1];
            return {
                path,
                visits: visits.length,
                duration: durationStats(visits.map((v) => v.durationMs)),
                first: visitStats(visits[0]),
                last: visitStats(lastVisit),
                lastVisit,
            };
        })
        .sort((a, b) => b.lastVisit.at - a.lastVisit.at);
}

// ── SQL ───────────────────────────────────────────────────────────────────

export type SqlQuerySummary = DurationStats & {
    text: string;
    /** Temps cumulé de toutes ses exécutions : ce qu'elle coûte vraiment */
    totalMs: number;
    families: string[];
};

/** Requêtes SQL regroupées par texte, de la plus coûteuse (temps cumulé) à la moins coûteuse. */
export function groupSqlQueries(calls: ApiCallRecord[], limit = 20): SqlQuerySummary[] {
    const runs = calls.flatMap((c) => c.queries.map((q) => ({ text: q.text, durationMs: q.durationMs, family: c.family })));
    return [...groupBy(runs, (r) => r.text).entries()]
        .map(([text, list]) => ({
            text,
            ...durationStats(list.map((r) => r.durationMs)),
            totalMs: list.reduce((s, r) => s + r.durationMs, 0),
            families: [...new Set(list.map((r) => r.family))],
        }))
        .sort((a, b) => b.totalMs - a.totalMs)
        .slice(0, limit);
}

// ── Vue en direct ─────────────────────────────────────────────────────────

/** `windowMs` null : toutes les mesures en mémoire ; `family` null : toutes les requêtes. */
export type LiveFilter = { now: number; windowMs: number | null; family: string | null };

/**
 * Un appel d'API dans la vue en direct : ses trois durées, mesurées sur le
 * MÊME appel (fetch du navigateur + son en-tête Server-Timing), donc
 * navigateur ≥ serveur ≥ base de données.
 */
export type LiveRow = {
    /** « 11:33:05 · members » : heure de l'appel et requête (nom court) */
    label: string;
    navigateur: number;
    serveur: number | null;
    /** null : réponse du cache, la base n'a pas été interrogée */
    base: number | null;
    /** Moyenne glissante du navigateur sur les derniers appels */
    tendance: number;
};

export type LiveData = {
    rows: LiveRow[];
    stats: {
        calls: number;
        browser: DurationStats;
        server: DurationStats;
        /** Base de données, sur les seuls appels exécutés (hors cache) */
        database: DurationStats;
        /** Part des appels servis par le cache (0–1) */
        cacheRate: number;
    };
    /** Distribution (p25 → p95) des trois durées, sur les mêmes appels que `stats` */
    distribution: { browser: PercentileProfile; server: PercentileProfile; database: PercentileProfile };
};

const inWindow = (at: number, f: LiveFilter) => f.windowMs === null || at >= f.now - f.windowMs;

/** « 11:33:05 » (heure locale du navigateur). */
function clockLabel(at: number): string {
    const d = new Date(at);
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Nom court d'une requête : « groupe-members » → « members ». */
export function shortFamily(family: string): string {
    return family.replace(/^[^-/]+[-/]/, "") || family;
}

/**
 * Vue en direct : les derniers appels (au plus `maxRows`), du plus ancien au
 * plus récent, sur la fenêtre et la requête choisies, et leurs indicateurs.
 */
export function liveData(client: ClientPerfRecord[], filter: LiveFilter, maxRows = 60, smoothing = 10): LiveData {
    const fetches = client
        .filter((r): r is ClientFetchRecord => r.kind === "fetch" && typeof r.at === "number")
        .filter((r) => inWindow(r.at, filter) && (!filter.family || fetchFamily(r) === filter.family))
        .sort((a, b) => a.at - b.at);
    const timings = fetches.map((r) => parseServerTiming(r.serverTiming));

    const allRows = fetches.map((r, i) => {
        const timing = timings[i];
        const family = fetchFamily(r);
        return {
            label: `${clockLabel(r.at)}${family ? ` · ${shortFamily(family)}` : ""}`,
            navigateur: round1(r.durationMs),
            serveur: timing ? round1(timing.totalMs) : null,
            base: timing && !timing.cacheHit ? round1(timing.sqlMs) : null,
            tendance: round1(average(fetches.slice(Math.max(0, i - smoothing + 1), i + 1).map((f) => f.durationMs))),
        };
    });

    const executed = timings.filter((t) => t && !t.cacheHit);
    const withTiming = timings.filter((t) => t !== null);
    const browserMs = fetches.map((r) => r.durationMs);
    const serverMs = withTiming.map((t) => t!.totalMs);
    const databaseMs = executed.map((t) => t!.sqlMs);
    return {
        rows: allRows.slice(-maxRows),
        stats: {
            calls: fetches.length,
            browser: durationStats(browserMs),
            server: durationStats(serverMs),
            database: durationStats(databaseMs),
            cacheRate: withTiming.length ? withTiming.filter((t) => t!.cacheHit).length / withTiming.length : 0,
        },
        distribution: {
            browser: percentileProfile(browserMs),
            server: percentileProfile(serverMs),
            database: percentileProfile(databaseMs),
        },
    };
}

/**
 * Graphique de distribution : une barre par percentile (p25 → p95), une série
 * par durée. Lecture : plus les barres montent vite de p50 à p95, plus les
 * appels lents s'écartent du cas courant.
 */
export function distributionChartRows(d: LiveData["distribution"]): { label: string; navigateur: number; serveur: number; base: number }[] {
    return DISTRIBUTION_PERCENTILES.map((p) => ({
        label: `p${p}`,
        navigateur: round1(d.browser.values[p]),
        serveur: round1(d.server.values[p]),
        base: round1(d.database.values[p]),
    }));
}

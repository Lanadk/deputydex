import {
    ApiCallRecord,
    ClientFetchRecord,
    ClientPerfRecord,
    SectionTimingRecord,
} from "@/app/_shared/dev-perf/dev-perf.types";
import { parseServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";

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

/** Percentile `p` (0–100) d'une liste de durées, méthode du rang le plus proche ; 0 si vide. */
export function percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.ceil((p / 100) * sorted.length);
    return sorted[Math.min(sorted.length, Math.max(1, rank)) - 1];
}

const average = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

/** Durées d'une série d'appels (0 partout si la série est vide). */
export type DurationStats = { count: number; avgMs: number; p95Ms: number };

function durationStats(values: number[]): DurationStats {
    return { count: values.length, avgMs: average(values), p95Ms: percentile(values, 95) };
}

export type RequestSummary = {
    family: string;
    calls: number;
    /** Côté serveur, use-case exécuté (cache manquant ou désactivé) */
    withoutCache: DurationStats & { avgSqlMs: number; avgSqlCount: number };
    /** Côté serveur, réponse servie par le cache */
    withCache: DurationStats;
    /** Côté navigateur : durée du fetch (réseau + serveur), quand la page a été mesurée */
    network: DurationStats;
};

export type DomainSummary = {
    domain: string;
    requests: RequestSummary[];
    /** Tous les appels sans cache du domaine confondus (moyennes pondérées par le nombre d'appels) */
    withoutCache: { count: number; avgMs: number; avgSqlMs: number };
    withCache: { count: number; avgMs: number };
    network: { count: number; avgMs: number };
};

/**
 * Perf par domaine puis par requête : sans cache / avec cache côté serveur
 * (durée, SQL), et réseau côté navigateur (durée du fetch). Les fetch du
 * navigateur sont rattachés à leur requête par l'en-tête Server-Timing.
 * Domaines par ordre alphabétique ; requêtes de la plus lente (p95 sans cache) à la plus rapide.
 */
export function summarizeByDomain(calls: ApiCallRecord[], client: ClientPerfRecord[]): DomainSummary[] {
    const callsByFamily = new Map<string, ApiCallRecord[]>();
    for (const c of calls) callsByFamily.set(c.family, [...(callsByFamily.get(c.family) ?? []), c]);

    const networkByFamily = new Map<string, number[]>();
    for (const r of client) {
        if (r.kind !== "fetch") continue;
        const family = parseFamily(r.serverTiming);
        if (family) networkByFamily.set(family, [...(networkByFamily.get(family) ?? []), r.durationMs]);
    }

    const byDomain = new Map<string, RequestSummary[]>();
    for (const family of new Set([...callsByFamily.keys(), ...networkByFamily.keys()])) {
        const list = callsByFamily.get(family) ?? [];
        const misses = list.filter((c) => !c.cacheHit);
        const summary: RequestSummary = {
            family,
            calls: list.length,
            withoutCache: {
                ...durationStats(misses.map((c) => c.totalMs)),
                avgSqlMs: average(misses.map((c) => c.sqlMs)),
                avgSqlCount: average(misses.map((c) => c.sqlCount)),
            },
            withCache: durationStats(list.filter((c) => c.cacheHit).map((c) => c.totalMs)),
            network: durationStats(networkByFamily.get(family) ?? []),
        };
        const domain = endpointDomain(family);
        byDomain.set(domain, [...(byDomain.get(domain) ?? []), summary]);
    }

    return [...byDomain.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([domain, requests]) => ({
            domain,
            requests: requests.sort((a, b) => b.withoutCache.p95Ms - a.withoutCache.p95Ms || a.family.localeCompare(b.family)),
            withoutCache: {
                count: sumOf(requests, (r) => r.withoutCache.count),
                avgMs: weightedAverage(requests, (r) => r.withoutCache, (s) => s.avgMs),
                avgSqlMs: weightedAverage(requests, (r) => r.withoutCache, (s) => s.avgSqlMs),
            },
            withCache: {
                count: sumOf(requests, (r) => r.withCache.count),
                avgMs: weightedAverage(requests, (r) => r.withCache, (s) => s.avgMs),
            },
            network: {
                count: sumOf(requests, (r) => r.network.count),
                avgMs: weightedAverage(requests, (r) => r.network, (s) => s.avgMs),
            },
        }));
}

const sumOf = <T>(list: T[], pick: (item: T) => number) => list.reduce((sum, item) => sum + pick(item), 0);

/** Moyenne des moyennes, pondérée par le nombre de mesures de chaque série. */
function weightedAverage<T, S extends { count: number }>(list: T[], series: (item: T) => S, value: (s: S) => number): number {
    const total = sumOf(list, (item) => series(item).count);
    return total ? sumOf(list, (item) => series(item).count * value(series(item))) / total : 0;
}

/**
 * Une ligne de graphique (en ms, moyennes arrondies) : `sql` + `horsSql` empilés
 * = serveur sans cache ; `cache` = serveur avec cache ; `reseau` = durée vue du navigateur.
 */
export type PerfChartRow = { label: string; sql: number; horsSql: number; cache: number; reseau: number };

/** Nom court d'une requête dans le graphique de son domaine : "groupe-cohesion" → "cohesion". */
export function shortRequestLabel(family: string): string {
    const short = family.replace(/^[^-/]+[-/]/, "");
    return short || family;
}

/** Graphique d'un domaine : une barre par requête. */
export function requestChartRows(requests: RequestSummary[]): PerfChartRow[] {
    return requests.map((r) => chartRow(shortRequestLabel(r.family), r.withoutCache.avgMs, r.withoutCache.avgSqlMs, r.withCache.avgMs, r.network.avgMs));
}

/** Graphique d'ensemble : une barre par domaine. */
export function domainChartRows(domains: DomainSummary[]): PerfChartRow[] {
    return domains.map((d) => chartRow(d.domain, d.withoutCache.avgMs, d.withoutCache.avgSqlMs, d.withCache.avgMs, d.network.avgMs));
}

function chartRow(label: string, serverMs: number, sqlMs: number, cacheMs: number, networkMs: number): PerfChartRow {
    const sql = Math.round(sqlMs);
    return { label, sql, horsSql: Math.max(0, Math.round(serverMs) - sql), cache: Math.round(cacheMs), reseau: Math.round(networkMs) };
}

/** Requête indiquée dans l'en-tête Server-Timing (`endpoint;desc="…"`). */
function parseFamily(serverTiming: string | null): string | null {
    return serverTiming ? /endpoint;desc="([^"]+)"/.exec(serverTiming)?.[1] ?? null : null;
}

export type SlowQuery = { durationMs: number; text: string; endpoint: string; at: number };

/** Les `limit` requêtes SQL les plus lentes, toutes routes confondues. */
export function slowestQueries(calls: ApiCallRecord[], limit = 20): SlowQuery[] {
    return calls
        .flatMap((c) => c.queries.map((q) => ({ durationMs: q.durationMs, text: q.text, endpoint: c.endpoint, at: c.at })))
        .sort((a, b) => b.durationMs - a.durationMs)
        .slice(0, limit);
}

export type PageVisit = {
    visitId: string;
    path: string;
    sections: SectionTimingRecord[];
    fetches: ClientFetchRecord[];
    /** Fin de la dernière mesure (ms depuis le début de la visite) */
    durationMs: number;
};

/** Toutes les visites, de la plus ancienne à la plus récente (les mesures arrivent dans l'ordre). */
function buildVisits(records: ClientPerfRecord[]): PageVisit[] {
    const visits = new Map<string, PageVisit>();
    for (const r of records) {
        const visit = visits.get(r.visitId) ?? { visitId: r.visitId, path: r.path, sections: [], fetches: [], durationMs: 0 };
        if (r.kind === "section") visit.sections.push(r);
        else visit.fetches.push(r);
        visit.durationMs = Math.max(visit.durationMs, r.startMs + r.durationMs);
        visits.set(r.visitId, visit);
    }
    return [...visits.values()].map((v) => ({
        ...v,
        sections: [...v.sections].sort((a, b) => a.startMs - b.startMs),
        fetches: [...v.fetches].sort((a, b) => a.startMs - b.startMs),
    }));
}

/** Mesures du navigateur regroupées par visite de page, de la plus récente à la plus ancienne. */
export function groupPageVisits(records: ClientPerfRecord[], limit = 10): PageVisit[] {
    return buildVisits(records).reverse().slice(0, limit);
}

/** Résumé d'une visite, pour comparer deux visites d'une même page. */
export type VisitStats = {
    /** Jusqu'à la dernière donnée reçue (ms depuis le début de la visite) */
    durationMs: number;
    apiCalls: number;
    /** Appels servis par le cache serveur (d'après leur en-tête Server-Timing) */
    cachedCalls: number;
    /** Somme du temps SQL des appels (chacun mesuré côté serveur) */
    sqlMs: number;
};

function visitStats(visit: PageVisit): VisitStats {
    const timings = visit.fetches.map((f) => parseServerTiming(f.serverTiming));
    return {
        durationMs: visit.durationMs,
        apiCalls: visit.fetches.length,
        cachedCalls: timings.filter((t) => t?.cacheHit).length,
        sqlMs: timings.reduce((sum, t) => sum + (t?.sqlMs ?? 0), 0),
    };
}

export type PageComparison = { path: string; visits: number; first: VisitStats; last: VisitStats };

/**
 * Pour chaque page visitée au moins deux fois : sa première et sa dernière
 * visite. Avec le cache actif, la première exécute le SQL et la dernière est
 * servie par le cache : l'écart mesure le gain du cache sur cette page.
 * Pages de la plus récemment visitée à la plus ancienne.
 */
export function comparePageVisits(records: ClientPerfRecord[]): PageComparison[] {
    const byPath = new Map<string, PageVisit[]>();
    for (const v of buildVisits(records)) byPath.set(v.path, [...(byPath.get(v.path) ?? []), v]);

    return [...byPath.entries()]
        .filter(([, visits]) => visits.length >= 2)
        .map(([path, visits]) => ({
            path,
            visits: visits.length,
            first: visitStats(visits[0]),
            last: visitStats(visits[visits.length - 1]),
        }))
        .reverse();
}

/**
 * Gain du cache serveur sur une requête : réduction de la durée moyenne
 * (part entre 0 et 1, et ms gagnées). null tant qu'il manque des appels
 * avec ou sans cache pour comparer.
 */
export function cacheGain(request: RequestSummary): { ratio: number; savedMs: number } | null {
    if (!request.withoutCache.count || !request.withCache.count) return null;
    const savedMs = request.withoutCache.avgMs - request.withCache.avgMs;
    return { ratio: request.withoutCache.avgMs > 0 ? savedMs / request.withoutCache.avgMs : 0, savedMs };
}

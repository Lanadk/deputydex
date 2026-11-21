import { DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";
import { DurationStats, PageVitals, summarizeByDomain, summarizePages } from "@/app/_shared/dev-perf/dev-perf.aggregate";

/*
 * Référence « avant » et comparaison « après » (outil de perf, voir app/6.DEV-PERF.md).
 * Une référence fige les percentiles de chaque requête et de chaque page à un
 * instant donné ; on la compare ensuite aux mesures en cours, pour chiffrer
 * l'effet d'une optimisation (cache, rendu progressif…). Fonctions pures.
 */

/** Médiane et p95 d'une série, et le nombre de mesures. */
export type Quantiles = { count: number; p50Ms: number; p95Ms: number };

export type PerfBaseline = {
    kind: "deputydex-perf-baseline";
    version: 1;
    label: string;
    /** ISO 8601 */
    createdAt: string;
    requests: Record<string, { server: Quantiles; withoutCache: Quantiles; network: Quantiles }>;
    pages: Record<string, { duration: Quantiles; vitals: PageVitals }>;
};

const quantiles = (s: DurationStats): Quantiles => ({ count: s.count, p50Ms: s.p50Ms, p95Ms: s.p95Ms });

/** Fige les mesures actuelles en référence. */
export function buildBaseline(snapshot: DevPerfSnapshot, label: string, createdAt: string): PerfBaseline {
    const requests: PerfBaseline["requests"] = {};
    for (const d of summarizeByDomain(snapshot.apiCalls, snapshot.client)) {
        for (const r of d.requests) {
            requests[r.family] = { server: quantiles(r.server), withoutCache: quantiles(r.withoutCache), network: quantiles(r.network) };
        }
    }
    const pages: PerfBaseline["pages"] = {};
    for (const p of summarizePages(snapshot.client)) pages[p.path] = { duration: quantiles(p.duration), vitals: p.vitals };
    return { kind: "deputydex-perf-baseline", version: 1, label, createdAt, requests, pages };
}

function isSnapshot(x: unknown): x is DevPerfSnapshot {
    const s = x as Partial<DevPerfSnapshot> | null;
    return !!s && Array.isArray(s.apiCalls) && Array.isArray(s.client);
}

/**
 * Lit un fichier importé : une référence exportée par la page, ou les mesures
 * brutes écrites par le script de bench (`npm run perf:bench`), dont on tire
 * la référence. null si le contenu n'est ni l'un ni l'autre.
 */
export function parseBaselineFile(json: unknown, fallbackLabel: string, now: string): PerfBaseline | null {
    const b = json as Partial<PerfBaseline> | null;
    if (b?.kind === "deputydex-perf-baseline" && b.version === 1 && b.requests && b.pages) return b as PerfBaseline;
    if (isSnapshot(json)) return buildBaseline(json, fallbackLabel, now);
    const bench = json as { label?: string; createdAt?: string; snapshot?: unknown } | null;
    if (bench && isSnapshot(bench.snapshot)) {
        return buildBaseline(bench.snapshot, bench.label ?? fallbackLabel, bench.createdAt ?? now);
    }
    return null;
}

/** Évolution en % de `before` à `after` (négatif = plus rapide) ; null sans référence exploitable. */
export function deltaPct(before: number | undefined, after: number | undefined): number | null {
    if (before === undefined || after === undefined || before <= 0) return null;
    return ((after - before) / before) * 100;
}

/*
 * Un écart n'est significatif que s'il dépasse le bruit de mesure, et un %
 * n'a de sens que sur une référence assez longue : de 0,2 ms (réponse du cache)
 * à 41 ms (appel exécuté), « +25 000 % » ne dit rien d'utile. Sous 1 ms de
 * référence, l'écart est donc donné en ms ; et avec trop peu de mesures (sur
 * 3 mesures, le p95 n'est que la plus lente), il est signalé comme incertain.
 */

/** Écart en % sous lequel deux séries sont jugées identiques (bruit de mesure). */
export const DELTA_NOISE_PCT = 10;
/** Référence sous laquelle l'écart est donné en ms plutôt qu'en %. */
export const SMALL_BASE_MS = 1;
/** Écart en ms sous lequel une référence sous 1 ms est jugée inchangée. */
export const DELTA_NOISE_MS = 5;
/** Mesures nécessaires de chaque côté pour qu'un écart soit fiable. */
export const MIN_COMPARABLE_SAMPLES = 5;

/** slower / faster : écart significatif ; same : dans le bruit ; uncertain : trop peu de mesures. */
export type DeltaTrend = "slower" | "faster" | "same" | "uncertain";

export type Delta = {
    /** Écart en ms (positif = plus lent) */
    ms: number;
    /** Écart en % ; null quand la référence est sous SMALL_BASE_MS (l'écart se lit en ms) */
    pct: number | null;
    trend: DeltaTrend;
};

/** Écart entre deux durées ; null s'il manque l'une des deux. */
export function compareDurations(before: number | undefined, after: number | undefined, fewSamples: boolean): Delta | null {
    if (before === undefined || after === undefined) return null;
    const ms = after - before;
    const pct = before >= SMALL_BASE_MS ? deltaPct(before, after) : null;
    const significant = pct === null ? Math.abs(ms) >= DELTA_NOISE_MS : Math.abs(pct) >= DELTA_NOISE_PCT;
    const trend: DeltaTrend = fewSamples ? "uncertain" : !significant ? "same" : ms > 0 ? "slower" : "faster";
    return { ms, pct, trend };
}

export type ComparisonRow = {
    key: string;
    before: Quantiles | null;
    after: Quantiles | null;
    p50: Delta | null;
    p95: Delta | null;
    /** Moins de MIN_COMPARABLE_SAMPLES mesures d'un côté : écarts indicatifs seulement */
    fewSamples: boolean;
};

/**
 * Gravité d'un écart pour le tri : % rapporté à une référence d'au moins 1 ms,
 * pour qu'un 0,2 → 41 ms ne passe pas devant une vraie régression de 100 → 300 ms.
 */
function severity(d: Delta | null, before: number | undefined): number {
    if (!d || before === undefined) return -Infinity;
    return (d.ms / Math.max(before, SMALL_BASE_MS)) * 100;
}

function compareSeries(before: Record<string, Quantiles>, after: Record<string, Quantiles>): ComparisonRow[] {
    const rank = (r: ComparisonRow) => (!r.before || !r.after ? 2 : r.fewSamples ? 1 : 0);
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .map((key) => {
            const b = before[key]?.count ? before[key] : null;
            const a = after[key]?.count ? after[key] : null;
            const fewSamples = !!b && !!a && Math.min(b.count, a.count) < MIN_COMPARABLE_SAMPLES;
            return {
                key,
                before: b,
                after: a,
                p50: compareDurations(b?.p50Ms, a?.p50Ms, fewSamples),
                p95: compareDurations(b?.p95Ms, a?.p95Ms, fewSamples),
                fewSamples,
            };
        })
        .filter((row) => row.before || row.after)
        // Écarts fiables d'abord (régressions en tête, p95), puis ceux sur trop peu de mesures,
        // puis les requêtes apparues ou disparues.
        .sort((x, y) => rank(x) - rank(y)
            || severity(y.p95, y.before?.p95Ms) - severity(x.p95, x.before?.p95Ms)
            || x.key.localeCompare(y.key));
}

/**
 * Compare une référence aux mesures actuelles : par requête (serveur, tous
 * appels confondus, et navigateur) et par page (durée jusqu'à la dernière donnée).
 */
export function compareToBaseline(baseline: PerfBaseline, current: PerfBaseline) {
    const pick = <T, K extends string>(rec: Record<string, T>, f: (v: T) => Quantiles) =>
        Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, f(v)])) as Record<K, Quantiles>;
    return {
        server: compareSeries(pick(baseline.requests, (r) => r.server), pick(current.requests, (r) => r.server)),
        network: compareSeries(pick(baseline.requests, (r) => r.network), pick(current.requests, (r) => r.network)),
        pages: compareSeries(pick(baseline.pages, (p) => p.duration), pick(current.pages, (p) => p.duration)),
    };
}

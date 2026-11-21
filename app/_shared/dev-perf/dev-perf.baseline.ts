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

export type ComparisonRow = {
    key: string;
    before: Quantiles | null;
    after: Quantiles | null;
    p50DeltaPct: number | null;
    p95DeltaPct: number | null;
};

function compareSeries(before: Record<string, Quantiles>, after: Record<string, Quantiles>): ComparisonRow[] {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
        .map((key) => {
            const b = before[key]?.count ? before[key] : null;
            const a = after[key]?.count ? after[key] : null;
            return {
                key,
                before: b,
                after: a,
                p50DeltaPct: deltaPct(b?.p50Ms, a?.p50Ms),
                p95DeltaPct: deltaPct(b?.p95Ms, a?.p95Ms),
            };
        })
        .filter((row) => row.before || row.after)
        // Régressions d'abord (p95 qui augmente le plus), puis le reste ; sans comparaison possible en dernier.
        .sort((x, y) => (y.p95DeltaPct ?? -Infinity) - (x.p95DeltaPct ?? -Infinity) || x.key.localeCompare(y.key));
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

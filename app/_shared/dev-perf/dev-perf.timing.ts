/*
 * En-tête `Server-Timing` des réponses d'API (outil de perf, voir app/6.DEV-PERF.md).
 * Fonctions pures, utilisables côté serveur (écriture) comme navigateur (lecture).
 */

export type ServerTimingValues = { totalMs: number; sqlMs: number; sqlCount: number; cacheHit: boolean };

/**
 * Valeur de l'en-tête, visible dans l'onglet Network du navigateur (Timing).
 * `family` (la requête, ex. "groupe-cohesion") permet à /dev/perf de rattacher
 * la durée réseau mesurée par le navigateur à sa requête.
 * ASCII uniquement : un en-tête HTTP n'accepte pas d'accents.
 */
export function buildServerTiming({ totalMs, sqlMs, sqlCount, cacheHit }: ServerTimingValues, family?: string): string {
    return [
        `total;dur=${totalMs.toFixed(1)}`,
        `db;dur=${sqlMs.toFixed(1)};desc="${sqlCount} SQL"`,
        `cache;desc="${cacheHit ? "hit" : "miss"}"`,
        ...(family ? [`endpoint;desc="${family.replace(/[^\x20-\x7E]|"/g, "")}"`] : []),
    ].join(", ");
}

/** Relit un en-tête produit par `buildServerTiming` ; null s'il est absent ou d'une autre forme. */
export function parseServerTiming(header: string | null): ServerTimingValues | null {
    if (!header) return null;
    const total = /total;dur=([\d.]+)/.exec(header);
    const db = /db;dur=([\d.]+);desc="(\d+) SQL"/.exec(header);
    if (!total || !db) return null;
    return {
        totalMs: Number(total[1]),
        sqlMs: Number(db[1]),
        sqlCount: Number(db[2]),
        cacheHit: /cache;desc="hit"/.test(header),
    };
}

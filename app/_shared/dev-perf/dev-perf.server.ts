import { AsyncLocalStorage } from "node:async_hooks";
import { SqlQueryRecord } from "@/app/_shared/dev-perf/dev-perf.types";
import { buildServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";
import { recordApiCall } from "@/app/_shared/dev-perf/dev-perf.store";
import { endpointFamily } from "@/app/_shared/dev-perf/dev-perf.aggregate";

/**
 * Mesures d'un appel d'API en cours, côté serveur. Ouvertes par `cachedResult`
 * autour du use-case ; chaque requête SQL exécutée dans ce contexte asynchrone
 * s'y ajoute (extension Prisma, voir `devPerfPrismaExtension`).
 */
export type RequestPerf = {
    endpoint: string;
    family: string;
    startedAt: number;
    /** false si le cache serveur a répondu sans exécuter le use-case */
    executed: boolean;
    queries: SqlQueryRecord[];
};

const requestPerfStorage = new AsyncLocalStorage<RequestPerf>();

export function startRequestPerf(keyParts: string[]): RequestPerf {
    return {
        endpoint: keyParts.join("/"),
        family: endpointFamily(keyParts),
        startedAt: performance.now(),
        executed: false,
        queries: [],
    };
}

/** Exécute `fn` dans le contexte de mesure `perf` (les requêtes SQL s'y rattachent). */
export function runWithRequestPerf<T>(perf: RequestPerf, fn: () => Promise<T>): Promise<T> {
    return requestPerfStorage.run(perf, fn);
}

export function currentRequestPerf(): RequestPerf | undefined {
    return requestPerfStorage.getStore();
}

/*
 * `cachedResult` mesure le use-case, `resultToResponse` construit la réponse :
 * le `Result` renvoyé par l'un et reçu par l'autre fait le lien entre les deux
 * (sans toucher aux 37 route handlers).
 */
const perfByResult = new WeakMap<object, RequestPerf>();

export function attachRequestPerf(result: object, perf: RequestPerf) {
    perfByResult.set(result, perf);
}

/**
 * Clôt la mesure de l'appel qui a produit `result` : ajoute l'en-tête
 * `Server-Timing` à la réponse et enregistre l'appel pour /dev/perf.
 * Sans mesure associée (paramètre invalide rejeté avant le use-case), ne fait rien.
 */
export function finishRequestPerf(result: object, response: Response, bytes = 0) {
    const perf = perfByResult.get(result);
    if (!perf) return;
    perfByResult.delete(result);

    const totalMs = performance.now() - perf.startedAt;
    const sqlMs = sqlWallTimeMs(perf.queries);
    const cacheHit = !perf.executed;

    response.headers.set("Server-Timing", buildServerTiming({ totalMs, sqlMs, sqlCount: perf.queries.length, cacheHit }, perf.family));
    recordApiCall({
        at: Date.now(),
        endpoint: perf.endpoint,
        family: perf.family,
        status: response.status,
        totalMs,
        sqlMs,
        sqlCount: perf.queries.length,
        cacheHit,
        queries: perf.queries,
        bytes,
    });
}

/** Taille en octets (UTF-8) du JSON d'une valeur : le poids du corps de la réponse. */
export function jsonBytes(value: unknown): number {
    return Buffer.byteLength(JSON.stringify(value) ?? "", "utf8");
}

/**
 * Temps pendant lequel au moins une requête SQL tourne. Les repositories
 * lancent souvent leurs requêtes en parallèle (`Promise.all`) : additionner
 * leurs durées compterait plusieurs fois les mêmes millisecondes et dépasserait
 * la durée de l'appel. On fusionne donc les intervalles qui se chevauchent.
 */
export function sqlWallTimeMs(queries: Pick<SqlQueryRecord, "offsetMs" | "durationMs">[]): number {
    const intervals = queries
        .map((q) => [q.offsetMs, q.offsetMs + q.durationMs] as const)
        .sort((a, b) => a[0] - b[0]);
    let total = 0;
    let current: [number, number] | null = null;
    for (const [start, end] of intervals) {
        if (current && start <= current[1]) {
            current[1] = Math.max(current[1], end);
        } else {
            if (current) total += current[1] - current[0];
            current = [start, end];
        }
    }
    if (current) total += current[1] - current[0];
    return total;
}

const SQL_TEXT_MAX_LENGTH = 600;

/**
 * Texte lisible d'une requête Prisma : le SQL d'un `$queryRaw` (paramètres en `$1`, `$2`…),
 * sinon `Modèle.opération`. Tronqué pour garder le stockage en mémoire léger.
 */
export function describePrismaQuery(model: string | undefined, operation: string, args: unknown): string {
    let text: string;
    const sql = args as { strings?: readonly string[]; sql?: string } | undefined;
    if (sql && Array.isArray(sql.strings)) {
        text = sql.strings.reduce((acc, part, i) => (i === 0 ? part : `${acc}$${i}${part}`), "");
    } else if (sql && typeof sql.sql === "string") {
        text = sql.sql;
    } else {
        text = model ? `${model}.${operation}` : operation;
    }
    text = text.replace(/\s+/g, " ").trim();
    return text.length > SQL_TEXT_MAX_LENGTH ? `${text.slice(0, SQL_TEXT_MAX_LENGTH)}…` : text;
}

/**
 * Extension Prisma qui chronomètre chaque requête (y compris `$queryRaw`) et
 * la rattache à l'appel d'API en cours. Sans appel d'API en cours (script,
 * page serveur), la requête n'est pas enregistrée.
 */
export const devPerfPrismaExtension = {
    name: "dev-perf",
    query: {
        async $allOperations({ model, operation, args, query }: {
            model?: string;
            operation: string;
            args: unknown;
            query: (args: unknown) => Promise<unknown>;
        }) {
            const perf = currentRequestPerf();
            if (!perf) return query(args);
            const start = performance.now();
            try {
                return await query(args);
            } finally {
                perf.queries.push({
                    text: describePrismaQuery(model, operation, args),
                    durationMs: performance.now() - start,
                    offsetMs: start - perf.startedAt,
                });
            }
        },
    },
};

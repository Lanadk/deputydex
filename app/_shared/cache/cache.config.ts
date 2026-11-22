import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";

/**
 * Configuration du cache serveur pour les endpoints de lecture adossés à Postgres.
 *
 * Les données parlementaires ne sont rafraîchies que par le pipeline d'import
 * externe — entre deux imports, retaper la DB à chaque requête n'apporte rien.
 * Ces routes sont donc servies depuis le cache serveur Next.js
 * (`unstable_cache`) pendant `ACTIVE_CACHE_TTL_SECONDS` (voir `resolveCacheTtl`).
 *
 * `NO_CACHE` (0) désactive le cache. ATTENTION : `unstable_cache()` lève une
 * exception si on lui passe `revalidate: 0` directement (Next.js n'accepte
 * que `false` ou un nombre `> 0` — voir `unstable-cache.js` dans `next/dist`).
 * `cachedRead` (dans `cached-response.ts`) contourne donc `unstable_cache`
 * entièrement quand la TTL active vaut `NO_CACHE`, et appelle `fn()` en
 * direct. Utile pour débugger en local sans devoir attendre l'expiration du
 * TTL.
 */
export const CACHE_TTL_SECONDS = {
    NO_CACHE: 0,
    DAY: 60 * 60 * 24,
    WEEK: 60 * 60 * 24 * 7,
} as const;

/**
 * TTL du cache selon l'environnement :
 * - **production** (`next build` puis `next start` / Docker) : 1 jour. Les
 *   données ne changent qu'à l'import quotidien de deputydex-data, qui vide
 *   tout le cache en fin de run (`POST /api/revalidate`). Le TTL n'est qu'un
 *   filet de sécurité si cet appel échoue : au pire, un jour de retard.
 * - **dev** (`npm run dev`) et **tests** : pas de cache, pour voir tout de
 *   suite les données d'un import local.
 * - **outil de perf local** (`NEXT_PUBLIC_DEV_PERF=true`, voir
 *   app/6.DEV-PERF.md) : `DEV_PERF_CACHE=true` force le cache, `=false` le
 *   coupe (mesure « sans cache » sur un build de prod). Sans l'outil, ignoré.
 */
export function resolveCacheTtl(env: {
    nodeEnv: string | undefined;
    devPerfEnabled: boolean;
    devPerfCache: string | undefined;
}): number {
    if (env.devPerfEnabled && env.devPerfCache === "true") return CACHE_TTL_SECONDS.DAY;
    if (env.devPerfEnabled && env.devPerfCache === "false") return CACHE_TTL_SECONDS.NO_CACHE;
    return env.nodeEnv === "production" ? CACHE_TTL_SECONDS.DAY : CACHE_TTL_SECONDS.NO_CACHE;
}

/** TTL actuellement actif pour l'ensemble des endpoints de lecture cachés. */
export const ACTIVE_CACHE_TTL_SECONDS: number = resolveCacheTtl({
    nodeEnv: process.env.NODE_ENV,
    devPerfEnabled: DEV_PERF_ENABLED,
    devPerfCache: process.env.DEV_PERF_CACHE,
});

/**
 * Tag partagé par toutes les entrées de cache "données parlementaires" :
 * `revalidateTag(PARLIAMENT_DATA_CACHE_TAG)` vide tout le cache d'un coup.
 * Appelé par `POST /api/revalidate` à la fin de l'import de deputydex-data.
 */
export const PARLIAMENT_DATA_CACHE_TAG = "parliament-data";

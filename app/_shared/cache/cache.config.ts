/**
 * Configuration du cache serveur pour les endpoints de lecture adossés à Postgres.
 *
 * Les données parlementaires ne sont rafraîchies que par le pipeline d'import
 * externe — entre deux imports, retaper la DB à chaque requête n'apporte rien.
 * Ces routes peuvent donc être servies depuis le cache serveur Next.js
 * (`unstable_cache`) pendant `ACTIVE_CACHE_TTL_SECONDS`.
 *
 * Pour passer d'un rafraîchissement hebdomadaire à quotidien : changer
 * `ACTIVE_CACHE_TTL_SECONDS` pour pointer vers `CACHE_TTL_SECONDS.DAY`.
 * Aucune autre modification n'est nécessaire.
 *
 * `NO_CACHE` (0) désactive le cache — `unstable_cache` traite `revalidate: 0`
 * comme "toujours revalider", donc chaque requête retape la DB. Utile pour
 * débugger en local sans devoir attendre l'expiration du TTL.
 */
export const CACHE_TTL_SECONDS = {
    NO_CACHE: 0,
    DAY: 60 * 60 * 24,
    WEEK: 60 * 60 * 24 * 7,
} as const;

/** TTL actuellement actif pour l'ensemble des endpoints de lecture cachés. */
export const ACTIVE_CACHE_TTL_SECONDS: number = CACHE_TTL_SECONDS.WEEK;

/**
 * Tag partagé par toutes les entrées de cache "données parlementaires".
 * Permet d'invalider tout le cache en un seul `revalidateTag(PARLIAMENT_DATA_CACHE_TAG)`
 * après un import, sans attendre l'expiration du TTL — pas encore câblé à un
 * endpoint, à faire si besoin d'une invalidation immédiate plus tard.
 */
export const PARLIAMENT_DATA_CACHE_TAG = "parliament-data";

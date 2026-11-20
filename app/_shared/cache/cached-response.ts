import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { ACTIVE_CACHE_TTL_SECONDS, CACHE_TTL_SECONDS, PARLIAMENT_DATA_CACHE_TAG } from "@/app/_shared/cache/cache.config";
import { Result } from "@/app/_shared/result-pattern/result";

/** Porte un `Result` en `DB_ERROR` hors de `unstable_cache`, qui ne met pas en cache ce qui lève. */
class UncachedFailure<E> extends Error {
    constructor(readonly result: Result<never, E>) {
        super("uncached failure");
    }
}

/**
 * `cachedRead` pour un use-case qui renvoie un `Result` : le succès et les
 * erreurs métier (`NOT_FOUND`…) sont mis en cache, mais PAS `DB_ERROR` — une
 * panne passagère de la base ne doit pas rester servie pendant tout le TTL.
 */
export async function cachedResult<T, E>(
    fn: () => Promise<Result<T, E>>,
    keyParts: string[],
    extraTags: string[] = []
): Promise<Result<T, E>> {
    try {
        return await cachedRead(async () => {
            const result = await fn();
            if (!result.success && result.error === "DB_ERROR") throw new UncachedFailure(result);
            return result;
        }, keyParts, extraTags);
    } catch (e) {
        if (e instanceof UncachedFailure) return e.result as Result<T, E>;
        throw e;
    }
}

/**
 * Exécute `fn` derrière le cache serveur Next.js (`unstable_cache`).
 *
 * IMPORTANT: cette fonction s'exécute côté serveur, dans le Route Handler —
 * contrairement à `fetch(url, { next: { revalidate } })`, elle fonctionne même
 * si l'appelant final est un composant client (ce qui est le cas ici, voir
 * les gateways sous app/(ui)/gateways/).
 *
 * `keyParts` doit inclure un identifiant stable de l'endpoint + tous les
 * paramètres qui font varier le résultat (id, code, legislature, ...) — sans
 * ça, deux requêtes différentes partageraient la même entrée de cache.
 *
 * `unstable_cache` refuse `revalidate: 0` (il lève une exception — seuls
 * `false` ou un nombre `> 0` sont acceptés). Quand `ACTIVE_CACHE_TTL_SECONDS`
 * vaut `CACHE_TTL_SECONDS.NO_CACHE`, on contourne donc `unstable_cache` et on
 * appelle `fn` directement, pour un vrai "pas de cache".
 */
export function cachedRead<T>(
    fn: () => Promise<T>,
    keyParts: string[],
    extraTags: string[] = []
): Promise<T> {
    if (ACTIVE_CACHE_TTL_SECONDS === CACHE_TTL_SECONDS.NO_CACHE) {
        return fn();
    }

    return unstable_cache(fn, keyParts, {
        revalidate: ACTIVE_CACHE_TTL_SECONDS,
        tags: [PARLIAMENT_DATA_CACHE_TAG, ...extraTags],
    })();
}

/**
 * NextResponse.json avec un header Cache-Control aligné sur le même TTL, pour
 * les réponses de succès des endpoints de lecture. Bénéfique si un CDN/edge
 * (ex: Vercel) est devant l'app ; inoffensif sinon.
 *
 * Ne pas utiliser sur les réponses d'erreur.
 */
export function cachedJson<T>(data: T, status = 200): NextResponse {
    return NextResponse.json(data, {
        status,
        headers: {
            "Cache-Control": `public, s-maxage=${ACTIVE_CACHE_TTL_SECONDS}, stale-while-revalidate=86400`,
        },
    });
}

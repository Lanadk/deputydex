import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { ACTIVE_CACHE_TTL_SECONDS, PARLIAMENT_DATA_CACHE_TAG } from "@/app/_shared/cache/cache.config";

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
 */
export function cachedRead<T>(
    fn: () => Promise<T>,
    keyParts: string[],
    extraTags: string[] = []
): Promise<T> {
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

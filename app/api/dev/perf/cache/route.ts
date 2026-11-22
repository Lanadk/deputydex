import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";
import { isLocalRequest } from "@/app/_shared/dev-perf/dev-perf.guard";
import { PARLIAMENT_DATA_CACHE_TAG } from "@/app/_shared/cache/cache.config";

/**
 * Outil de perf (dev seulement) : vide le cache serveur des données
 * parlementaires, pour mesurer une page « cache froid » puis « cache chaud ».
 * Nécessaire car ce cache est conservé sur disque (.next/cache) d'une session
 * à l'autre, même après un nouveau build.
 * 404 sans NEXT_PUBLIC_DEV_PERF=true (donc en production), et pour toute
 * requête qui ne vient pas de la machine elle-même (voir dev-perf.guard).
 */
export async function DELETE(req: Request): Promise<Response> {
    if (!DEV_PERF_ENABLED || !isLocalRequest(req.headers)) {
        return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    // { expire: 0 } : les entrées expirent tout de suite, le prochain appel est un vrai miss
    // (forme recommandée par Next 16 hors Server Action ; voir la doc de revalidateTag).
    revalidateTag(PARLIAMENT_DATA_CACHE_TAG, { expire: 0 });
    return new NextResponse(null, { status: 204 });
}

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { PARLIAMENT_DATA_CACHE_TAG } from "@/app/_shared/cache/cache.config";
import { checkRevalidateAccess } from "@/app/_shared/cache/revalidate.guard";

/**
 * POST /api/revalidate — vide le cache serveur des données parlementaires.
 *
 * Appelé par deputydex-data à la fin de l'import quotidien (dernière étape
 * d'`updateAll`), pour que les nouvelles données apparaissent sans attendre
 * l'expiration du TTL ni redéployer. Accès : voir `revalidate.guard.ts`.
 */
export async function POST(req: Request): Promise<Response> {
    const access = checkRevalidateAccess(req.headers, process.env.REVALIDATE_SECRET);
    if (access === "disabled" || access === "public") {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    if (access === "unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // expire: 0 → entrées supprimées tout de suite : la visite suivante relit la base.
    revalidateTag(PARLIAMENT_DATA_CACHE_TAG, { expire: 0 });
    const at = new Date().toISOString();
    console.info(`[revalidate] cache « ${PARLIAMENT_DATA_CACHE_TAG} » vidé à ${at}`);

    return NextResponse.json({ revalidated: true, tag: PARLIAMENT_DATA_CACHE_TAG, at });
}

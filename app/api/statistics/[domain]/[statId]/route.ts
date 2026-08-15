import { NextResponse } from "next/server";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";
import { STAT_HANDLERS } from "@/app/api/statistics/_handlers/stat-handlers.registry";

/**
 * Point d'entrée HTTP unique pour TOUTES les stats du catalogue Statistiques,
 * quel que soit le domaine — résout `(domain, statId)` via `STAT_HANDLERS`
 * (voir `_handlers/stat-handlers.registry.ts`). Ajouter une stat n'ajoute
 * jamais de route : une entrée dans le handler du domaine concerné suffit.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ domain: string; statId: string }> }
): Promise<Response> {
    const { domain, statId } = await params;

    const handler = STAT_HANDLERS[domain]?.[statId];
    if (!handler) {
        return NextResponse.json({ error: `Stat introuvable : ${domain}/${statId}` }, { status: 404 });
    }

    try {
        const url = new URL(req.url);
        const entityId = url.searchParams.get("entityId") ?? undefined;
        const filtersRaw = url.searchParams.get("filters");
        const filters = filtersRaw ? JSON.parse(filtersRaw) : undefined;

        const data = await cachedRead(
            () => handler({ entityId, filters }),
            ["stat", domain, statId, entityId ?? "", filtersRaw ?? ""]
        );

        if (!data) {
            return NextResponse.json({ error: `Failed to compute stat ${domain}/${statId}` }, { status: 500 });
        }

        return cachedJson(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: `Failed to compute stat ${domain}/${statId}` }, { status: 500 });
    }
}

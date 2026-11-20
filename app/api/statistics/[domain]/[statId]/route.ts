import { err } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { STAT_HANDLERS } from "@/app/api/statistics/_handlers/stat-handlers.registry";

/**
 * Point d'entrée HTTP unique pour TOUTES les stats du catalogue Statistiques,
 * quel que soit le domaine — résout `(domain, statId)` via `STAT_HANDLERS`
 * (voir `_handlers/stat-handlers.registry.ts`). Ajouter une stat n'ajoute
 * jamais de route : une entrée dans le handler du domaine concerné suffit.
 *
 * Stat inconnue → 404 ; `filters` qui n'est pas du JSON, ou paramètre requis
 * absent (voir le handler) → 400 ; panne d'un repository → 500.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ domain: string; statId: string }> }
): Promise<Response> {
    const { domain, statId } = await params;

    const handler = STAT_HANDLERS[domain]?.[statId];
    if (!handler) {
        return resultToResponse(err("NOT_FOUND"), { NOT_FOUND: `Stat introuvable : ${domain}/${statId}` });
    }

    const url = new URL(req.url);
    const entityId = url.searchParams.get("entityId") ?? undefined;
    const filtersRaw = url.searchParams.get("filters");
    let filters: Record<string, unknown> | undefined;
    try {
        filters = filtersRaw ? JSON.parse(filtersRaw) : undefined;
    } catch {
        return resultToResponse(err("INVALID_INPUT"), { INVALID_INPUT: "Paramètre filters : JSON invalide" });
    }

    const result = await cachedResult(
        () => handler({ entityId, filters }),
        ["stat", domain, statId, entityId ?? "", filtersRaw ?? ""]
    );

    return resultToResponse(result, { INVALID_INPUT: `Paramètre requis absent pour la stat ${domain}/${statId}` });
}

import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getScrutinsListUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-list.use-case";
import { parseScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { prismaScrutinListRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-list.repository";

/**
 * GET /api/scrutins/list/[legislature]?portee=&q=&resultat=&type=&objet=&page=&pageSize=
 * Filtrage et pagination côté serveur (voir `parseScrutinListFilters`).
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const search = new URL(req.url).searchParams;
    const filters = parseScrutinListFilters(parsed.data, {
        portee: search.get("portee"),
        q: search.get("q"),
        resultat: search.get("resultat"),
        type: search.get("type"),
        objet: search.get("objet"),
        page: search.get("page"),
        pageSize: search.get("pageSize"),
    });

    const result = await cachedResult(
        () => getScrutinsListUseCase(prismaScrutinListRepository, filters),
        ["scrutins-list", JSON.stringify(filters)]
    );

    return resultToResponse(result);
}

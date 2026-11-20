import { NextResponse } from "next/server";
import { getScrutinsListUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-list.use-case";
import { parseScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { prismaScrutinListRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-list.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

/**
 * GET /api/scrutins/list/[legislature]?portee=&q=&resultat=&type=&objet=&page=&pageSize=
 * Filtrage et pagination côté serveur (voir `parseScrutinListFilters`).
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const search = new URL(req.url).searchParams;
    const filters = parseScrutinListFilters(Number(legislature), {
        portee: search.get("portee"),
        q: search.get("q"),
        resultat: search.get("resultat"),
        type: search.get("type"),
        objet: search.get("objet"),
        page: search.get("page"),
        pageSize: search.get("pageSize"),
    });

    try {
        const result = await cachedRead(
            () => getScrutinsListUseCase(prismaScrutinListRepository, filters),
            ["scrutins-list", JSON.stringify(filters)]
        );
        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get scrutins" }, { status: 500 });
    }
}

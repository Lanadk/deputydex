import { NextResponse } from "next/server";
import { getGroupesListUseCase } from "@/app/domains/groupes/use-cases/get-groupes-list.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

/**
 * Liste BRUTE des groupes d'une législature — PAS la même chose que
 * `/api/groupes/cards/[legislature]` : NI et les groupes à 0 membre courant
 * (renommés/dissous en cours de législature) sont INCLUS ici, pour un
 * sélecteur "n'importe quel groupe ayant existé" (voir
 * `IGroupesStatsRepository.listGroupesLegislature`). Consommé par
 * `EntityChartLib` dans les thèmes "Chiffres clés" (ex: `participation-presence`).
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const legislatureNumber = Number(legislature);

    try {
        const result = await cachedRead(
            () => getGroupesListUseCase(prismaGroupesStatsRepository, legislatureNumber),
            ["groupes-list", legislature]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json({ error: result.error }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get groupes list" }, { status: 500 });
    }
}

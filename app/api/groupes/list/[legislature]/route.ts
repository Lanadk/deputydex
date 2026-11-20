import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getGroupesListUseCase } from "@/app/domains/groupes/use-cases/get-groupes-list.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";

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
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getGroupesListUseCase(prismaGroupesStatsRepository, parsed.data),
        ["groupes-list", legislature]
    );

    return resultToResponse(result);
}

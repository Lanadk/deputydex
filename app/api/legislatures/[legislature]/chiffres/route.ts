import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getLegislatureChiffresUseCase } from "@/app/domains/legislatures/use-cases/get-legislature-chiffres.use-case";
import { prismaLegislatureOrganisationRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository";

/** GET /api/legislatures/[legislature]/chiffres — chiffres clés de la législature. */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    // Durée de la législature en cours comptée jusqu'à aujourd'hui : la date fait partie de la clé de cache.
    const aujourdhui = new Date().toISOString().slice(0, 10);
    const result = await cachedResult(
        () => getLegislatureChiffresUseCase(prismaLegislatureOrganisationRepository, parsed.data, aujourdhui),
        ["legislature-chiffres", legislature, aujourdhui]
    );

    return resultToResponse(result, { NOT_FOUND: `Législature inconnue : ${legislature}` });
}

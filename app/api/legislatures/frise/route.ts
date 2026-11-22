import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { getLegislaturesFriseUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-frise.use-case";
import { prismaLegislatureOrganisationRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository";

/** GET /api/legislatures/frise — frise chronologique des législatures et des institutions en place. */
export async function GET(): Promise<Response> {
    // La frise s'arrête aujourd'hui : la date fait partie de la clé de cache.
    const aujourdhui = new Date().toISOString().slice(0, 10);
    const result = await cachedResult(
        () => getLegislaturesFriseUseCase(prismaLegislatureOrganisationRepository, aujourdhui),
        ["legislatures-frise", aujourdhui]
    );

    return resultToResponse(result);
}

import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";


export async function GET(): Promise<Response> {
    const result = await cachedResult(
        () => getCurrentLegislatureUseCase(prismaLegislaturesRepository),
        ["legislature-current"]
    );

    return resultToResponse(result, { NOT_FOUND: "Aucune législature en cours" });
}

import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { getDeputeLegislaturesUseCase } from "@/app/domains/deputes/use-cases/get-depute-legislatures.use-case";
import { prismaDeputeLegislaturesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-legislatures.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string }> }
): Promise<Response> {
    const { uid } = await params;

    const result = await cachedResult(
        () => getDeputeLegislaturesUseCase(prismaDeputeLegislaturesRepository, uid),
        ["depute-legislatures", uid]
    );

    return resultToResponse(result);
}

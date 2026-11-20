import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { getScrutinVotesUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-votes.use-case";
import { prismaScrutinDetailRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-detail.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string }> }
): Promise<Response> {
    const { uid } = await params;

    const result = await cachedResult(
        () => getScrutinVotesUseCase(prismaScrutinDetailRepository, uid),
        ["scrutin-votes", uid]
    );

    return resultToResponse(result);
}

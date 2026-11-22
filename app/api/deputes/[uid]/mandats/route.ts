import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { getDeputeMandatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-mandats.use-case";
import { prismaDeputeMandatsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-mandats.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string }> }
): Promise<Response> {
    const { uid } = await params;

    const result = await cachedResult(
        () => getDeputeMandatsUseCase(prismaDeputeMandatsRepository, uid),
        ["depute-mandats", uid]
    );

    return resultToResponse(result);
}

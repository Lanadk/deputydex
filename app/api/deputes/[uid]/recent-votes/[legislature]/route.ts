import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeRecentVotesUseCase } from "@/app/domains/deputes/use-cases/get-depute-recent-votes.use-case";
import { prismaDeputeRecentVotesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-recent-votes.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputeRecentVotesUseCase(prismaDeputeRecentVotesRepository, uid, parsed.data, 20),
        ["depute-recent-votes", uid, legislature]
    );

    return resultToResponse(result);
}

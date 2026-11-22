import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeVoteStatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-vote-stats.use-case";
import { prismaDeputeVoteStatsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-vote-stats.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputeVoteStatsUseCase(prismaDeputeVoteStatsRepository, uid, parsed.data),
        ["depute-vote-stats", uid, legislature]
    );

    return resultToResponse(result, { NOT_FOUND: "Aucune donnée de vote" });
}

import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeAmendementStatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-amendement-stats.use-case";
import { prismaDeputeAmendementStatsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-amendement-stats.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputeAmendementStatsUseCase(prismaDeputeAmendementStatsRepository, uid, parsed.data),
        ["depute-amendement-stats", uid, legislature]
    );

    return resultToResponse(result, { NOT_FOUND: "Aucune donnée d'amendement" });
}

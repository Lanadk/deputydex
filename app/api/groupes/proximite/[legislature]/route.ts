import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getGroupesProximiteUseCase } from "@/app/domains/groupes/use-cases/get-groupes-proximite.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getGroupesProximiteUseCase(prismaGroupesStatsRepository, parsed.data),
        ["groupes-proximite", legislature]
    );

    return resultToResponse(result);
}

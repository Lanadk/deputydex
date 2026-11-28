import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getIndicateursDeputesUseCase } from "@/app/domains/presence/use-cases/get-indicateurs-deputes.use-case";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";

/** Indicateurs de présence (global, séance, commission, scrutins) de tous les députés d'une législature. */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getIndicateursDeputesUseCase(prismaPresenceStatsRepository, parsed.data),
        ["deputes-indicateurs", legislature]
    );

    return resultToResponse(result);
}

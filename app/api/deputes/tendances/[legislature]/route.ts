import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputesTendancesUseCase } from "@/app/domains/deputes/use-cases/get-deputes-tendances.use-case";
import { prismaDeputesTendancesRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-tendances.repository";

/** GET /api/deputes/tendances/[legislature] — « ce mois-ci » : assidu, rebelle, amendements. */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputesTendancesUseCase(prismaDeputesTendancesRepository, parsed.data),
        ["deputes-tendances", legislature]
    );

    return resultToResponse(result);
}

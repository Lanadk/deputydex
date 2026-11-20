import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputesAgeExtremesUseCase } from "@/app/domains/deputes/use-cases/get-deputes-age-extremes.use-case";
import { prismaDeputesAgeRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-age.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputesAgeExtremesUseCase(prismaDeputesAgeRepository, parsed.data),
        ["deputes-age-extremes", legislature]
    );

    return resultToResponse(result);
}

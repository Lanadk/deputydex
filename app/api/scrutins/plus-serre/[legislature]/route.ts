import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getScrutinPlusSerreUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-plus-serre.use-case";
import { prismaScrutinsPeriodeRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutins-periode.repository";

/** GET /api/scrutins/plus-serre/[legislature] — le scrutin le plus serré du mois. */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getScrutinPlusSerreUseCase(prismaScrutinsPeriodeRepository, parsed.data),
        ["scrutin-plus-serre", legislature]
    );

    return resultToResponse(result);
}

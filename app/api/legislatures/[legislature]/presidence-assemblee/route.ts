import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getPresidenceAssembleeUseCase } from "@/app/domains/legislatures/use-cases/get-presidence-assemblee.use-case";
import { prismaPresidenceAssembleeRepository } from "@/app/infrastructure/legislatures/repositories/prisma-presidence-assemblee.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getPresidenceAssembleeUseCase(prismaPresidenceAssembleeRepository, parsed.data),
        ["presidence-assemblee", legislature]
    );

    return resultToResponse(result, { NOT_FOUND: "Aucune présidence de l'Assemblée connue pour cette législature" });
}

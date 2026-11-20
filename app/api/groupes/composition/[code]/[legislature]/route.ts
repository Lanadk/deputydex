import {isErr} from "@/app/_shared/result-pattern/result";
import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {parseLegislature} from "@/app/domains/legislatures/parse-legislature";
import {getGroupeCompositionUseCase} from "@/app/domains/groupes/use-cases/get-groupe-composition.use-case";
import {
    prismaGroupeCompositionRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-composition.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { code, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getGroupeCompositionUseCase(prismaGroupeCompositionRepository, code, parsed.data),
        ["groupe-composition", code, legislature]
    );

    return resultToResponse(result, { NOT_FOUND: "Groupe introuvable" });
}

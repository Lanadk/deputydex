import {isErr} from "@/app/_shared/result-pattern/result";
import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {parseLegislature} from "@/app/domains/legislatures/parse-legislature";
import {getGroupeCohesionUseCase} from "@/app/domains/groupes/use-cases/get-groupe-cohesion.use-case";
import {
    prismaGroupeCohesionRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { code, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getGroupeCohesionUseCase(prismaGroupeCohesionRepository, code, parsed.data),
        ["groupe-cohesion", code, legislature]
    );

    return resultToResponse(result);
}

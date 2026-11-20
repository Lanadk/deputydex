import {isErr} from "@/app/_shared/result-pattern/result";
import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {parseLegislature} from "@/app/domains/legislatures/parse-legislature";
import {getGroupeComportementUseCase} from "@/app/domains/groupes/use-cases/get-groupe-comportement.use-case";
import prismaGroupeComportementRepository
    from "@/app/infrastructure/groupes/repositories/prisma-groupe-comportement.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { code, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getGroupeComportementUseCase(prismaGroupeComportementRepository, code, parsed.data),
        ["groupe-comportement", code, legislature]
    );

    return resultToResponse(result);
}

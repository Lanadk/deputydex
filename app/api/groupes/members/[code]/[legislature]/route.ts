import {isErr} from "@/app/_shared/result-pattern/result";
import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {parseLegislature} from "@/app/domains/legislatures/parse-legislature";
import {getGroupeMembersUseCase} from "@/app/domains/groupes/use-cases/get-groupe-members.use-case";
import {
    prismaGroupeMembersRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-members.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { code, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getGroupeMembersUseCase(prismaGroupeMembersRepository, code, parsed.data),
        ["groupe-members", code, legislature]
    );

    return resultToResponse(result);
}

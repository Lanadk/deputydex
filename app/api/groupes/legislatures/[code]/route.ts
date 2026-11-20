import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {getGroupeLegislaturesUseCase} from "@/app/domains/groupes/use-cases/get-groupe-legislatures.use-case";
import {prismaGroupeLegislaturesRepository} from "@/app/infrastructure/groupes/repositories/prisma-groupe-legislatures.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string}> }
): Promise<Response> {
    const { code } = await params;

    const result = await cachedResult(
        () => getGroupeLegislaturesUseCase(prismaGroupeLegislaturesRepository, code),
        ["groupe-legislatures", code]
    );

    return resultToResponse(result);
}

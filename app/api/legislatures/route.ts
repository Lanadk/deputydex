import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {getAllLegislaturesUseCase} from "@/app/domains/legislatures/use-cases/get-all-legislatures.use-case";
import {
    prismaLegislaturesRepository
} from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";


export async function GET(): Promise<Response> {
    const result = await cachedResult(
        () => getAllLegislaturesUseCase(prismaLegislaturesRepository),
        ["legislatures-all"]
    );

    return resultToResponse(result);
}

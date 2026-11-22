import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { searchDeputiesUseCase } from "@/app/domains/acteurs/use-cases/search-deputies.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";

export async function GET(req: Request): Promise<Response> {
    const search = new URL(req.url).searchParams.get("search") ?? undefined;

    const result = await cachedResult(
        () => searchDeputiesUseCase(prismaActeursStatsRepository, search),
        ["deputies-search", search ?? ""]
    );

    return resultToResponse(result);
}

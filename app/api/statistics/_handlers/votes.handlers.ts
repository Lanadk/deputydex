import { isOk } from "@/app/_shared/result-pattern/result";
import { getVotesPositionsStatUseCase } from "@/app/domains/votes/use-cases/get-votes-positions-stat.use-case";
import { prismaVotesStatsRepository } from "@/app/infrastructure/votes/repositories/prisma-votes-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedRead` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> RawStatData` et ne jamais implémenter leur propre cache.
 */
export const VOTES_STAT_HANDLERS: Record<string, StatHandler> = {
    positions: async () => {
        const result = await getVotesPositionsStatUseCase(prismaVotesStatsRepository);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
};

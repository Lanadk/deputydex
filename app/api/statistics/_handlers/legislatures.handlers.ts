import { isOk } from "@/app/_shared/result-pattern/result";
import { getLegislaturesPariteEvolutionUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-parite-evolution.use-case";
import { prismaLegislaturesStatsRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedRead` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> RawStatData` et ne jamais implémenter leur propre cache.
 */
export const LEGISLATURES_STAT_HANDLERS: Record<string, StatHandler> = {
    parite: async () => {
        const result = await getLegislaturesPariteEvolutionUseCase(prismaLegislaturesStatsRepository);
        if (!isOk(result)) return null;
        return { shape: "timeseries", points: result.data.points };
    },
};

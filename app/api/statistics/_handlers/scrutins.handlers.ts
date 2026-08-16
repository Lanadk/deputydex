import { isOk } from "@/app/_shared/result-pattern/result";
import { getScrutinsParticipationStatUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-participation-stat.use-case";
import { prismaScrutinsStatsRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutins-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedRead` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> RawStatData` et ne jamais implémenter leur propre cache.
 */
export const SCRUTINS_STAT_HANDLERS: Record<string, StatHandler> = {
    participation: async () => {
        const result = await getScrutinsParticipationStatUseCase(prismaScrutinsStatsRepository);
        if (!isOk(result)) return null;
        return { shape: "timeseries", points: result.data.points };
    },
};

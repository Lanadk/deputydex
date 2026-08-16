import { isOk } from "@/app/_shared/result-pattern/result";
import { getScrutinsParticipationStatUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-participation-stat.use-case";
import { getScrutinsTotalUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-total.use-case";
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
    total: async (params) => {
        // Voir votes.handlers.ts "total" : "scrutins" n'a pas non plus
        // d'EntityResolver — même fallback "toutes législatures confondues"
        // plutôt qu'un échec quand le filtre législature est absent.
        const legislature = params.filters?.legislature as number | undefined;

        const result = await getScrutinsTotalUseCase(prismaScrutinsStatsRepository, legislature);
        if (!isOk(result)) return null;
        return {
            shape: "scalar",
            value: result.data.total,
            label: legislature ? "scrutins" : "scrutins — toutes législatures confondues",
        };
    },
};

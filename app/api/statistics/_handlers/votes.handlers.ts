import { isOk } from "@/app/_shared/result-pattern/result";
import { getVotesPositionsStatUseCase } from "@/app/domains/votes/use-cases/get-votes-positions-stat.use-case";
import { getVotesTotalUseCase } from "@/app/domains/votes/use-cases/get-votes-total.use-case";
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
    // `legislature` optionnelle sur les deux stats : VotesEntityResolver
    // (voir ENTITY_RESOLVERS) impose déjà son choix avant de rendre ce
    // domaine "prêt" en mode Statistiques avancées (comportement identique
    // à groupes/acteurs), mais d'autres appelants (ex: chiffres-clés) restent
    // libres de ne pas en fournir — dans ce cas on agrège toutes législatures
    // confondues plutôt que d'échouer.
    positions: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;

        const result = await getVotesPositionsStatUseCase(prismaVotesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    total: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;

        const result = await getVotesTotalUseCase(prismaVotesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return {
            shape: "scalar",
            value: result.data.total,
            label: legislature ? "votes" : "votes — toutes législatures confondues",
        };
    },
};

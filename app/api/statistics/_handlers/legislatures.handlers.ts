import { isErr, ok } from "@/app/_shared/result-pattern/result";
import { getLegislaturesPariteEvolutionUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-parite-evolution.use-case";
import { prismaLegislaturesStatsRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import { getAssembleePresenceParLegislatureUseCase } from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";
import { PRESENCE_MOYENNE_STAT_HANDLERS } from "@/app/api/statistics/_handlers/presence-moyenne.handlers";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedResult` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> Result<RawStatData>` et ne jamais implémenter leur propre cache.
 *
 * Une législature est imposée par LegislaturesEntityResolver. `parite` et
 * `presence` l'ignorent volontairement : ce sont des comparaisons ENTRE
 * législatures (toutes affichées). La présence moyenne détaillée (jour, mois,
 * années) de la législature choisie est partagée avec « Tous les députés »
 * du domaine acteurs (`presence-moyenne-*`).
 */
export const LEGISLATURES_STAT_HANDLERS: Record<string, StatHandler> = {
    parite: async () => {
        const result = await getLegislaturesPariteEvolutionUseCase(prismaLegislaturesStatsRepository);
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    presence: async () => {
        const result = await getAssembleePresenceParLegislatureUseCase(prismaPresenceStatsRepository);
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.items });
    },
    ...PRESENCE_MOYENNE_STAT_HANDLERS,
};

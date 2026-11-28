import { isErr, ok } from "@/app/_shared/result-pattern/result";
import { getLegislaturesPariteEvolutionUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-parite-evolution.use-case";
import { prismaLegislaturesStatsRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import {
    getAssembleePresenceAnnuelleUseCase,
    getAssembleePresenceComposantesUseCase,
    getAssembleePresenceEvolutionUseCase,
    getAssembleePresenceJournaliereUseCase,
    getAssembleePresenceJoursMensuelsUseCase,
    getAssembleePresenceJourSemaineUseCase,
    getAssembleePresenceParLegislatureUseCase,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedResult` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> Result<RawStatData>` et ne jamais implémenter leur propre cache.
 *
 * Présence de l'Assemblée : le domaine n'a pas de sélecteur de législature dans
 * le mode avancé (comme `parite`, toutes législatures) ; un filtre
 * `legislature` optionnel restreint à une seule — utilisé par les Chiffres
 * clés, qui suivent le sélecteur global.
 */
const legislatureOptionnelle = (params: Parameters<StatHandler>[0]) => params.filters?.legislature as number | undefined;

export const LEGISLATURES_STAT_HANDLERS: Record<string, StatHandler> = {
    parite: async () => {
        const result = await getLegislaturesPariteEvolutionUseCase(prismaLegislaturesStatsRepository);
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },

    // ── Présence de l'Assemblée (domaine presence) ──
    presence: async (params) => {
        const result = await getAssembleePresenceParLegislatureUseCase(prismaPresenceStatsRepository, legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.items });
    },
    "presence-composantes": async (params) => {
        const result = await getAssembleePresenceComposantesUseCase(prismaPresenceStatsRepository, legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    },
    "presence-evolution": async (params) => {
        const result = await getAssembleePresenceEvolutionUseCase(prismaPresenceStatsRepository, legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    "presence-jours-mensuels": async (params) => {
        const result = await getAssembleePresenceJoursMensuelsUseCase(prismaPresenceStatsRepository, legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    "presence-journaliere": async (params) => {
        const result = await getAssembleePresenceJournaliereUseCase(prismaPresenceStatsRepository, legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    "presence-jour-semaine": async (params) => {
        const result = await getAssembleePresenceJourSemaineUseCase(prismaPresenceStatsRepository, legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    },
    "presence-annee-civile": async (params) => {
        const result = await getAssembleePresenceAnnuelleUseCase(prismaPresenceStatsRepository, "civile", legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.items });
    },
    "presence-annee-parlementaire": async (params) => {
        const result = await getAssembleePresenceAnnuelleUseCase(prismaPresenceStatsRepository, "parlementaire", legislatureOptionnelle(params));
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.items });
    },
};

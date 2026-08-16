import { isOk } from "@/app/_shared/result-pattern/result";
import { getGroupeStatPariteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite.use-case";
import { getGroupeStatEffectifsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-effectifs.use-case";
import { getGroupeStatCohesionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion.use-case";
import { getGroupeStatPariteMoyenneUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite-moyenne.use-case";
import { getGroupeStatPositionsVoteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-positions-vote.use-case";
import { getGroupeStatExpressionVotesUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-expression-votes.use-case";
import { getGroupeStatParticipationUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation.use-case";
import { getGroupeStatParticipationEvolutionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation-evolution.use-case";
import { getGroupeStatParticipationEvolutionTousUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation-evolution-tous.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedRead` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> RawStatData` et ne jamais implémenter leur propre cache.
 */
export const GROUPES_STAT_HANDLERS: Record<string, StatHandler> = {
    parite: async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return null;

        const result = await getGroupeStatPariteUseCase(prismaGroupesStatsRepository, code, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    effectifs: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return null;

        const result = await getGroupeStatEffectifsUseCase(prismaGroupesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    cohesion: async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return null;

        const result = await getGroupeStatCohesionUseCase(prismaGroupesStatsRepository, code, legislature);
        if (!isOk(result)) return null;
        return { shape: "timeseries", points: result.data.points };
    },
    // Pas exposée dans GROUPES_STATS (pas une stat du picker) — usage interne
    // par les insights (voir _shared/statistics/insights/) pour situer une
    // stat par rapport à la moyenne du domaine.
    "parite-moyenne": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return null;

        const result = await getGroupeStatPariteMoyenneUseCase(prismaGroupesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    "positions-de-vote": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return null;

        const result = await getGroupeStatPositionsVoteUseCase(prismaGroupesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "multi-series", series: result.data.series };
    },
    "expression-votes": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return null;

        const result = await getGroupeStatExpressionVotesUseCase(prismaGroupesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    participation: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return null;

        const result = await getGroupeStatParticipationUseCase(prismaGroupesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    "participation-evolution": async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return null;

        const result = await getGroupeStatParticipationEvolutionUseCase(prismaGroupesStatsRepository, code, legislature);
        if (!isOk(result)) return null;
        return { shape: "timeseries", points: result.data.points };
    },
    "participation-evolution-groupes": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return null;

        const result = await getGroupeStatParticipationEvolutionTousUseCase(prismaGroupesStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "multi-series", series: result.data.series };
    },
};

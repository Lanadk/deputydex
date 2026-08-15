import { isOk } from "@/app/_shared/result-pattern/result";
import { getGroupeStatPariteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite.use-case";
import { getGroupeStatEffectifsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-effectifs.use-case";
import { getGroupeStatCohesionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion.use-case";
import { getGroupeStatPariteMoyenneUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite-moyenne.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

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
};

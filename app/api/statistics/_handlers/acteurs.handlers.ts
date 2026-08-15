import { isOk } from "@/app/_shared/result-pattern/result";
import { getActeursAgeDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-age-distribution.use-case";
import { getActeursGenderDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-gender-distribution.use-case";
import { getActeurMandatsCountUseCase } from "@/app/domains/acteurs/use-cases/get-acteur-mandats-count.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

export const ACTEURS_STAT_HANDLERS: Record<string, StatHandler> = {
    "age-distribution": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        const result = await getActeursAgeDistributionUseCase(prismaActeursStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    parite: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        const result = await getActeursGenderDistributionUseCase(prismaActeursStatsRepository, legislature);
        if (!isOk(result)) return null;
        return { shape: "distribution", items: result.data.items };
    },
    mandats: async (params) => {
        if (!params.entityId) return null;
        const result = await getActeurMandatsCountUseCase(prismaActeursStatsRepository, params.entityId);
        if (!isOk(result)) return null;
        return { shape: "scalar", value: result.data.count, label: "mandats" };
    },
};

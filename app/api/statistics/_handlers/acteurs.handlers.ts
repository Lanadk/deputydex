import { err, isErr, ok } from "@/app/_shared/result-pattern/result";
import { getActeursAgeDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-age-distribution.use-case";
import { getActeursGenderDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-gender-distribution.use-case";
import { getActeurMandatsCountUseCase } from "@/app/domains/acteurs/use-cases/get-acteur-mandats-count.use-case";
import { getActeursProfessionDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-profession-distribution.use-case";
import { getActeursProfessionFamilleDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-profession-famille-distribution.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedResult` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> Result<RawStatData>` et ne jamais implémenter leur propre cache.
 */
export const ACTEURS_STAT_HANDLERS: Record<string, StatHandler> = {
    "age-distribution": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        const result = await getActeursAgeDistributionUseCase(prismaActeursStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    parite: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        const result = await getActeursGenderDistributionUseCase(prismaActeursStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    mandats: async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const result = await getActeurMandatsCountUseCase(prismaActeursStatsRepository, params.entityId);
        if (isErr(result)) return result;
        return ok({ shape: "scalar", value: result.data.count, label: "mandats" });
    },
    professions: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getActeursProfessionDistributionUseCase(prismaActeursStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    "professions-famille": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getActeursProfessionFamilleDistributionUseCase(prismaActeursStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
};

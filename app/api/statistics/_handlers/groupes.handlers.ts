import { err, isErr, ok } from "@/app/_shared/result-pattern/result";
import { getGroupeStatPariteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite.use-case";
import { getGroupeStatEffectifsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-effectifs.use-case";
import { getGroupeStatCohesionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion.use-case";
import { getGroupeStatCohesionLegislatureUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion-legislature.use-case";
import { getGroupeStatCohesionEvolutionTousUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion-evolution-tous.use-case";
import { getGroupeStatCumulMandatsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cumul-mandats.use-case";
import { getGroupeStatPariteMoyenneUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite-moyenne.use-case";
import { getGroupeStatPositionsVoteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-positions-vote.use-case";
import { getGroupeStatExpressionVotesUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-expression-votes.use-case";
import { getGroupeStatParticipationUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation.use-case";
import { getGroupeStatParticipationEvolutionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation-evolution.use-case";
import { getGroupeStatParticipationEvolutionTousUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation-evolution-tous.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import {
    getGroupePresenceEvolutionUseCase,
    getGroupesPresenceAnnuelleUseCase,
    getGroupesPresenceEvolutionUseCase,
    getGroupesPresenceJoursParMoisUseCase,
    getGroupesPresenceUseCase,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";

/** Présence de tous les groupes par type d'année (civile / parlementaire) — une série par groupe. */
function groupesPresenceAnnuelle(type: "civile" | "parlementaire"): StatHandler {
    return async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupesPresenceAnnuelleUseCase(prismaPresenceStatsRepository, legislature, type);
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    };
}

/**
 * Le cache est géré une seule fois, de façon générique, par `route.ts`
 * (`cachedResult` dans `app/_shared/cache/cached-response.ts`), qui enveloppe
 * l'appel à `handler(params)` quel que soit le domaine/statId résolu. Les
 * handlers ci-dessous doivent rester de simples fonctions pures
 * `params -> Result<RawStatData>` et ne jamais implémenter leur propre cache.
 */
export const GROUPES_STAT_HANDLERS: Record<string, StatHandler> = {
    parite: async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatPariteUseCase(prismaGroupesStatsRepository, code, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    effectifs: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatEffectifsUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    cohesion: async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatCohesionUseCase(prismaGroupesStatsRepository, code, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    "cohesion-legislature": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatCohesionLegislatureUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    "cohesion-evolution-groupes": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatCohesionEvolutionTousUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    },
    "cumul-mandats": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatCumulMandatsUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    // Pas exposée dans GROUPES_STATS (pas une stat du picker) — usage interne
    // par les insights (voir _shared/statistics/insights/) pour situer une
    // stat par rapport à la moyenne du domaine.
    "parite-moyenne": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatPariteMoyenneUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    "positions-de-vote": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatPositionsVoteUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    },
    "expression-votes": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatExpressionVotesUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    participation: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatParticipationUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    "participation-evolution": async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatParticipationEvolutionUseCase(prismaGroupesStatsRepository, code, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    "participation-evolution-groupes": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupeStatParticipationEvolutionTousUseCase(prismaGroupesStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    },

    // ── Présence des groupes (domaine presence) ──
    presence: async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupesPresenceUseCase(prismaPresenceStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    "presence-jours-par-mois": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupesPresenceJoursParMoisUseCase(prismaPresenceStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "distribution", items: result.data.items });
    },
    "presence-evolution-groupes": async (params) => {
        const legislature = params.filters?.legislature as number | undefined;
        if (!legislature) return err("INVALID_INPUT");

        const result = await getGroupesPresenceEvolutionUseCase(prismaPresenceStatsRepository, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    },
    "presence-evolution": async (params) => {
        const code = params.entityId;
        const legislature = params.filters?.legislature as number | undefined;
        if (!code || !legislature) return err("INVALID_INPUT");

        const result = await getGroupePresenceEvolutionUseCase(prismaPresenceStatsRepository, code, legislature);
        if (isErr(result)) return result;
        return ok({ shape: "timeseries", points: result.data.points });
    },
    "presence-annee-civile": groupesPresenceAnnuelle("civile"),
    "presence-annee-parlementaire": groupesPresenceAnnuelle("parlementaire"),
};

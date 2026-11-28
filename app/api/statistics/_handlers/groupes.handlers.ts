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
import { PresenceComposante } from "@/app/domains/presence/entities/presence-stats.entity";
import {
    getGroupesPresenceComposantesUseCase,
    getGroupesPresenceComposanteUseCase,
    getGroupePresenceAnnuelleUseCase,
    getGroupePresenceComposantesUseCase,
    getGroupePresenceEvolutionUseCase,
    getGroupesPresenceAnnuelleUseCase,
    getGroupesPresenceEvolutionUseCase,
    getGroupesPresenceJoursParMoisUseCase,
    getGroupesPresenceUseCase,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { prismaPresenceStatsRepository as presenceRepo } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";
import { courbe, parEntiteEtLegislature, parPerimetre, repartition, series } from "@/app/api/statistics/_handlers/presence-handlers.helpers";

// Présence de tous les groupes (`parPerimetre`) : une législature ou « toutes »
// (chaque groupe de chaque législature à part, « RN · 16ᵉ » — pas de fusion).
// Présence d'UN groupe (`parEntiteEtLegislature`) : une législature précise.

/** Classement des groupes sur une composante de la présence (séance, commission, excusés, scrutins). */
function groupesPresenceComposante(composante: PresenceComposante): StatHandler {
    return parPerimetre((p) => getGroupesPresenceComposanteUseCase(presenceRepo, p, composante), repartition);
}

/** Présence de tous les groupes par type d'année (civile / parlementaire) — une série par groupe. */
function groupesPresenceAnnuelle(type: "civile" | "parlementaire"): StatHandler {
    return parPerimetre((p) => getGroupesPresenceAnnuelleUseCase(presenceRepo, p, type), series, type);
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
    presence: parPerimetre((p) => getGroupesPresenceUseCase(presenceRepo, p), repartition),
    "presence-jours-par-mois": parPerimetre((p) => getGroupesPresenceJoursParMoisUseCase(presenceRepo, p), repartition),
    "presence-evolution-groupes": parPerimetre((p) => getGroupesPresenceEvolutionUseCase(presenceRepo, p), series, "mois"),
    // Un groupe précis : par législature seulement (son code ne désigne pas le même groupe d'une législature à l'autre).
    "presence-evolution": parEntiteEtLegislature((code, leg) => getGroupePresenceEvolutionUseCase(presenceRepo, code, leg), courbe),
    "presence-seance": groupesPresenceComposante("seance"),
    "presence-commission": groupesPresenceComposante("commission"),
    "presence-excuses-commission": groupesPresenceComposante("excuses"),
    "presence-scrutins": groupesPresenceComposante("scrutins"),
    "presence-composantes": parPerimetre((p) => getGroupesPresenceComposantesUseCase(presenceRepo, p), series),
    "presence-annee-civile": groupesPresenceAnnuelle("civile"),
    "presence-annee-parlementaire": groupesPresenceAnnuelle("parlementaire"),
    "presence-composantes-groupe": parEntiteEtLegislature((code, leg) => getGroupePresenceComposantesUseCase(presenceRepo, code, leg), series),
    "presence-annee-parlementaire-groupe": parEntiteEtLegislature((code, leg) => getGroupePresenceAnnuelleUseCase(presenceRepo, code, leg, "parlementaire"), courbe),
    "presence-annee-civile-groupe": parEntiteEtLegislature((code, leg) => getGroupePresenceAnnuelleUseCase(presenceRepo, code, leg, "civile"), courbe),
};

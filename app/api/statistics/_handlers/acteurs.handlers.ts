import { err, isErr, ok } from "@/app/_shared/result-pattern/result";
import { getActeursAgeDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-age-distribution.use-case";
import { getActeursGenderDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-gender-distribution.use-case";
import { getActeurMandatsCountUseCase } from "@/app/domains/acteurs/use-cases/get-acteur-mandats-count.use-case";
import { getActeursProfessionDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-profession-distribution.use-case";
import { getActeursProfessionFamilleDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-profession-famille-distribution.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import {
    getDeputePresenceAnnuelleUseCase,
    getDeputePresenceComposantesUseCase,
    getDeputePresenceContexteUseCase,
    getDeputePresenceEvolutionUseCase,
    getDeputePresenceJoursMensuelsUseCase,
    getDeputePresenceSourcesUseCase,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";
import { PresenceTypePeriode } from "@/app/domains/presence/entities/presence-stats.entity";
import { PRESENCE_MOYENNE_STAT_HANDLERS } from "@/app/api/statistics/_handlers/presence-moyenne.handlers";
import { avecReperes } from "@/app/api/statistics/_handlers/presence-reperes";
import { lirePerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";

/**
 * Ajoute aux stats de présence d'un député la note de contexte (prise de
 * fonction, jours attendus / présents par législature) — affichée sous le
 * libellé du graphe. Une panne de la note ne bloque pas la stat.
 */
function avecContexteDepute(handler: StatHandler): StatHandler {
    return async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const [stat, contexte] = await Promise.all([
            handler(params),
            getDeputePresenceContexteUseCase(prismaPresenceStatsRepository, params.entityId, legislatureDepute(params)),
        ]);
        if (isErr(stat) || isErr(contexte) || !contexte.data) return stat;
        return ok({ ...stat.data, note: contexte.data });
    };
}

/**
 * Périmètre des stats de présence d'un député : absent = une série par
 * législature (mode avancé par défaut) ; un numéro = cette législature (fiche
 * député, ou choix en mode avancé) ; « toutes » = ses législatures confondues
 * (lignes legislature IS NULL : un député réélu y a ses jours sommés).
 */
const legislatureDepute = (params: Parameters<StatHandler>[0]) => lirePerimetreLegislature(params.filters?.legislature);

/** Présence d'un député par type d'année (civile / parlementaire / mandat), en courbe. */
function deputePresenceAnnuelle(type: PresenceTypePeriode): StatHandler {
    return avecContexteDepute(async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const perimetre = legislatureDepute(params);
        // Pas d'année de mandat combinée (voir agg_deputes_presence_annuelle).
        if (type === "mandat" && perimetre === TOUTES_LEGISLATURES) return err("INVALID_INPUT");
        const result = await getDeputePresenceAnnuelleUseCase(prismaPresenceStatsRepository, params.entityId, type, perimetre);
        if (isErr(result)) return result;
        return ok(await avecReperes({ shape: "timeseries", points: result.data.items }, perimetre, type === "mandat" ? undefined : type));
    });
}

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

    // ── Présence d'un député (domaine presence ; filtre législature optionnel) ──
    "presence-sources": avecContexteDepute(async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const result = await getDeputePresenceSourcesUseCase(prismaPresenceStatsRepository, params.entityId, legislatureDepute(params));
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    }),
    "presence-composantes": avecContexteDepute(async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const result = await getDeputePresenceComposantesUseCase(prismaPresenceStatsRepository, params.entityId, legislatureDepute(params));
        if (isErr(result)) return result;
        return ok({ shape: "multi-series", series: result.data.series });
    }),
    // Taux de présence = la courbe mensuelle.
    presence: avecContexteDepute(async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const result = await getDeputePresenceEvolutionUseCase(prismaPresenceStatsRepository, params.entityId, legislatureDepute(params));
        if (isErr(result)) return result;
        return ok(await avecReperes({ shape: "timeseries", points: result.data.points }, legislatureDepute(params), "mois"));
    }),
    "presence-jours-mensuels": avecContexteDepute(async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const result = await getDeputePresenceJoursMensuelsUseCase(prismaPresenceStatsRepository, params.entityId, legislatureDepute(params));
        if (isErr(result)) return result;
        return ok(await avecReperes({ shape: "timeseries", points: result.data.points }, legislatureDepute(params), "mois"));
    }),
    "presence-annee-civile": deputePresenceAnnuelle("civile"),
    "presence-annee-parlementaire": deputePresenceAnnuelle("parlementaire"),
    "presence-annee-mandat": deputePresenceAnnuelle("mandat"),

    // ── Présence moyenne de tous les députés (une législature) ──
    ...PRESENCE_MOYENNE_STAT_HANDLERS,
};

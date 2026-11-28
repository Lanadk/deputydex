import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { presenceMoyenneStats } from "@/app/(ui)/_shared/statistics/catalog/domains/presence-moyenne.stats";

// Branché sur agg_groupes_stats_parite, sommé par législature — voir
// STAT_HANDLERS dans app/api/statistics/[domain]/[statId]/route.ts.
export const LEGISLATURES_STATS: StatDefinition[] = [
    defineStat("legislatures", "parite", {
        scope: "aggregate",
        title: "Évolution de la parité",
        category: "Composition",
        keywords: ["parité", "évolution", "législatures"],
        description: "Montre si la part de femmes élues à l'Assemblée progresse ou recule d'une législature à l'autre.",
        methodology: "Pour chaque législature : nombre total de député·es femmes ayant siégé / nombre total de " +
            "député·es ayant siégé (tous groupes confondus, y compris Non inscrits) × 100 — une valeur par " +
            "législature, du début de la Vᵉ République à aujourd'hui.",
        dataShape: "timeseries",
        unit: "%",
        // Comparaison entre législatures : a du sens aussi en « Toutes ».
        allLegislatures: true,
    }),
    defineStat("legislatures", "presence", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Taux de présence, législature par législature",
        category: "Présence",
        keywords: ["présence", "assiduité", "assemblée", "législatures"],
        description: "La part des jours attendus où les député·es ont été présent·es, toute l'Assemblée, d'une législature à l'autre. Ignore la législature choisie : toutes sont affichées, pour les comparer.",
        methodology: "Jour attendu : séance publique avec au moins un scrutin public, ou convocation en commission " +
            "d'un organe dont le député est membre. Présent : vote personnel (hors délégation), prise de parole ou " +
            "interruption en séance, présence en commission. Taux pondéré : somme des jours présents ÷ somme des " +
            "jours attendus de tous les députés de la législature.",
        dataShape: "timeseries",
        unit: "%",
    }),

    // ── Présence moyenne de la législature choisie (ou de toutes) ──
    ...presenceMoyenneStats("legislatures"),
];

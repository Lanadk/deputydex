import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

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
    }),
];

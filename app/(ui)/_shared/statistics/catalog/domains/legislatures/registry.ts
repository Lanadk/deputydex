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
        methodology: "Part de femmes élues, comparée d'une législature à l'autre.",
        dataShape: "timeseries",
        unit: "%",
    }),
];

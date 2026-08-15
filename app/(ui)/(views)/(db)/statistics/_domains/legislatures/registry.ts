import { defineStat } from "@/app/(ui)/(views)/(db)/statistics/_catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

// Branché sur agg_groupes_stats_parite, sommé par législature — voir
// STAT_HANDLERS dans app/api/statistics/[domain]/[statId]/route.ts.
export const LEGISLATURES_STATS: StatDefinition[] = [
    defineStat("legislatures", "parite", {
        scope: "aggregate",
        title: "Évolution de la parité",
        category: "Composition",
        keywords: ["parité", "évolution", "législatures"],
        methodology: "Part de femmes élues, comparée d'une législature à l'autre.",
        dataShape: "timeseries",
        unit: "%",
    }),
];

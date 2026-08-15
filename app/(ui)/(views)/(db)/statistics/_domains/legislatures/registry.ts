import { defineStat } from "@/app/(ui)/(views)/(db)/statistics/_catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

// TODO: mock — le backend "legislatures" existe déjà (ILegislaturesRepository)
// mais n'est pas encore branché sur le catalogue de stats ; cette entrée est
// mockée côté serveur (STAT_HANDLERS) en attendant.
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

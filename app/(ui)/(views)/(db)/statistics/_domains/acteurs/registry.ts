import { defineStat } from "@/app/(ui)/(views)/(db)/statistics/_catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

export const ACTEURS_STATS: StatDefinition[] = [
    defineStat("acteurs", "age-distribution", {
        scope: "aggregate",
        title: "Répartition par tranche d'âge",
        category: "Démographie",
        keywords: ["âge", "démographie", "tranche d'âge", "députés"],
        methodology:
            "Âge calculé à partir de la date de naissance déclarée de chaque député actuellement recensé, " +
            "regroupé par tranches de 10 ans (moins de 30 ans, 30-39, 40-49, 50-59, 60-69, 70 ans et plus).",
        dataShape: "distribution",
        unit: "députés",
    }),
];

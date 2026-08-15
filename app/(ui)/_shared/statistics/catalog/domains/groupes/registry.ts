import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

// Branché sur de vraies tables agrégées (agg_groupes_stats_parite,
// agg_groupes_effectifs_legislature, agg_groupes_stats_cohesion_mensuelle),
// voir STAT_HANDLERS dans app/api/statistics/[domain]/[statId]/route.ts.
export const GROUPES_STATS: StatDefinition[] = [
    defineStat("groupes", "parite", {
        scope: "entity",
        title: "Parité au sein du groupe",
        category: "Composition",
        keywords: ["parité", "genre", "groupe", "composition"],
        methodology: "Répartition par genre déclaré des membres du groupe sélectionné.",
        dataShape: "distribution",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
    }),
    defineStat("groupes", "effectifs", {
        scope: "aggregate",
        title: "Effectifs par groupe",
        category: "Composition",
        keywords: ["effectifs", "taille", "membres", "tous les groupes"],
        methodology: "Nombre de membres actuellement recensés, par groupe parlementaire.",
        dataShape: "distribution",
        unit: "membres",
    }),
    defineStat("groupes", "cohesion", {
        scope: "entity",
        title: "Évolution de la cohésion",
        category: "Cohésion",
        keywords: ["cohésion", "vote", "évolution", "groupe"],
        methodology: "Taux de cohésion de vote du groupe sélectionné, calculé mois par mois sur la législature en cours.",
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
    }),
];

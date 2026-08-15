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
        description: "Indique l'équilibre entre hommes et femmes au sein de ce groupe parlementaire précis.",
        methodology: "Répartition par genre déclaré des membres du groupe sélectionné.",
        dataShape: "distribution",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        // PAS de chartVariant "parliament-group" ici : les items sont
        // "Hommes"/"Femmes", pas des groupes — le variant les colorerait
        // tous les deux en gris par défaut (aucune correspondance trouvée),
        // ce qui est pire que la palette générique.
    }),
    defineStat("groupes", "effectifs", {
        scope: "aggregate",
        title: "Effectifs par groupe",
        category: "Composition",
        keywords: ["effectifs", "taille", "membres", "tous les groupes"],
        description: "Compare la taille des différents groupes parlementaires pour situer leur poids respectif à l'Assemblée.",
        methodology: "Nombre de membres actuellement recensés, par groupe parlementaire.",
        dataShape: "distribution",
        unit: "membres",
        // Un item par groupe (label = code/libellé du groupe) — le cas
        // d'usage exact du variant.
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "cohesion", {
        scope: "entity",
        title: "Évolution de la cohésion",
        category: "Cohésion",
        keywords: ["cohésion", "vote", "évolution", "groupe"],
        description: "Montre si les membres de ce groupe votent de plus en plus, ou de moins en moins, dans le même sens au fil des mois.",
        methodology: "Taux de cohésion de vote du groupe sélectionné, calculé mois par mois sur la législature en cours.",
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        // Une seule série = le groupe sélectionné — colore la courbe avec sa
        // couleur (voir StatViewer, qui résout le code du groupe depuis le
        // contexte pour le passer en `groupLabel`).
        chartVariant: "parliament-group",
    }),
];

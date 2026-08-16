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
    defineStat("groupes", "positions-de-vote", {
        scope: "aggregate",
        title: "Positions de vote par groupe",
        category: "Votes",
        keywords: ["positions", "vote", "pour", "contre", "abstention", "tous les groupes"],
        description: "Compare, pour chaque groupe parlementaire, la part de votes exprimés pour / contre / en abstention sur l'ensemble des scrutins politiques.",
        methodology: "Répartition des votes individuels des membres de chaque groupe sur les positions politiques (pour/contre/abstention), hors non-votants — les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus.",
        dataShape: "multi-series",
        unit: "%",
        // Un item par groupe (nom de série = code/libellé du groupe) — même
        // cas d'usage que groupes.effectifs.
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "expression-votes", {
        scope: "aggregate",
        title: "Taux d'expression aux scrutins",
        category: "Votes",
        keywords: ["expression", "participation", "scrutins", "tous les groupes"],
        description: "Part des positions politiques (pour/contre/abstention) exprimées par chaque groupe, par rapport à l'ensemble des positions possibles (non-votants inclus).",
        methodology: "Nombre de positions politiques exprimées, divisé par le nombre total de positions observées (positions politiques + non-votants), par groupe, sur la législature — les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus.",
        dataShape: "distribution",
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "participation", {
        scope: "aggregate",
        title: "Taux de participation aux scrutins",
        category: "Votes",
        keywords: ["participation", "présence", "scrutins", "tous les groupes"],
        description: "Compare, pour chaque groupe parlementaire, la part des scrutins auxquels ses membres ont effectivement pris part (pour, contre ou abstention) parmi ceux où ils étaient éligibles à voter.",
        methodology: "Moyenne pondérée par le nombre de scrutins éligibles (pas une moyenne simple des mois), par groupe, sur la législature — les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus.",
        dataShape: "distribution",
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "participation-evolution", {
        scope: "entity",
        title: "Évolution de la participation",
        category: "Votes",
        keywords: ["participation", "évolution", "groupe"],
        description: "Montre si les membres de ce groupe participent de plus en plus, ou de moins en moins, aux scrutins au fil des mois.",
        methodology: "Taux de participation moyen des député·es du groupe sélectionné (scrutins effectivement votés parmi ceux où ils étaient éligibles), calculé mois par mois. Un groupe renommé/dissous en cours de législature (ex: UDR → UDDPLR, SOC-NUPES → SOC) apparaît sous plusieurs codes distincts, chacun avec sa propre période — ce n'est pas un artefact, choisir l'un ou l'autre montre la période correspondante.",
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "participation-evolution-groupes", {
        scope: "aggregate",
        title: "Évolution de la participation, tous groupes",
        category: "Votes",
        keywords: ["participation", "évolution", "tous les groupes"],
        description: "Compare, mois par mois, le taux de participation aux scrutins de tous les groupes parlementaires de la législature.",
        methodology: "Taux de participation moyen des député·es, calculé mois par mois pour chaque groupe. Un groupe renommé/dissous en cours de législature (ex: SOC-NUPES → SOC) apparaît comme deux séries distinctes, chacune sur sa propre période.",
        dataShape: "multi-series",
        unit: "%",
        chartVariant: "parliament-group",
    }),
];

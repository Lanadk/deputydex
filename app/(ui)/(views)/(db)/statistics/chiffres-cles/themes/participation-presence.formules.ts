import { FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

/**
 * Formules EXACTES des indicateurs de participation du thème « Participation &
 * présence », une par graphique / tableau (champ `formulas` du bloc, affiché
 * en accordéon juste sous lui), recopiées du SQL qui les calcule (deputydex-data) :
 * agg_groupes_stats_participation_legislature / _mensuelle, et la requête
 * scrutins.participation (prisma-scrutins-stats.repository.ts). Toute évolution
 * de ces vues doit se refléter ici. Les formules de présence, partagées avec les
 * fiches député et groupe, sont dans `_shared/statistics/presence/presence-formules.ts`.
 *
 * Notations : d un député, g un groupe, s un scrutin, m un mois. Taux arrondis
 * à 2 décimales pour la participation par groupe.
 */

// ── Participation aux scrutins ───────────────────────────────────────────────

export const F_PARTICIPATION_GROUPE: FormulaLibProps = {
    label: "taux de participation d'un groupe",
    result: "τ_{g}",
    numerator: "Σ_{d ∈ g} Σ_{s ∈ E_{d,g}} 𝟙[v_{d,s} ∈ {pour, contre, abstention}]",
    denominator: "Σ_{d ∈ g} |E_{d,g}|",
    factor: "× 100",
    legend: [
        { symbol: "d ∈ g", description: "un député ayant été membre du groupe g pendant la législature" },
        { symbol: "E_{d,g}", description: "scrutins publics de la législature tenus pendant que d était membre de g (scrutins éligibles)" },
        { symbol: "v_{d,s}", description: "position de d au scrutin s ; absente = non-votant" },
    ],
    note: "Pondéré par les scrutins éligibles : un député présent toute la législature pèse plus qu'un député resté deux mois. Taux d'absence = 100 − τ_{g}.",
};

export const F_PARTICIPATION_ASSEMBLEE: FormulaLibProps = {
    label: "taux de participation mensuel",
    result: "τ_{m}",
    numerator: "1",
    denominator: "|S_{m}|",
    factor: "× Σ_{s ∈ S_{m}} V_{s} ÷ (V_{s} + NV_{s}) × 100",
    legend: [
        { symbol: "S_{m}", description: "scrutins publics du mois m (toutes législatures)" },
        { symbol: "V_{s}", description: "votants du scrutin s (pour, contre ou abstention)" },
        { symbol: "NV_{s}", description: "non-votants du scrutin s" },
    ],
    note: "Moyenne simple : chaque scrutin compte pour 1, qu'il ait réuni 30 ou 570 votants.",
};

export const F_PARTICIPATION_GROUPE_MOIS: FormulaLibProps = {
    label: "taux de participation d'un groupe, par mois",
    result: "τ_{g,m}",
    numerator: "1",
    denominator: "N_{g,m}",
    factor: "× Σ_{d ∈ g} p_{d,m} ÷ e_{d,m} × 100",
    legend: [
        { symbol: "N_{g,m}", description: "députés membres de g ayant au moins un scrutin éligible dans le mois m" },
        { symbol: "e_{d,m}", description: "scrutins du mois m tenus pendant que d était membre de g" },
        { symbol: "p_{d,m}", description: "parmi eux, scrutins où d a voté pour, contre ou s'est abstenu" },
    ],
    note: "Moyenne des taux individuels du mois (chaque député pèse autant), contrairement au classement, pondéré par les scrutins.",
};

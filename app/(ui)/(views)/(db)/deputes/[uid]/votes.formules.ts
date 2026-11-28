import { FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

/**
 * Formule de la participation aux votes de la section « Comportement au vote »
 * de la fiche député (agg_deputes_stats_votes de deputydex-data). À ne pas
 * confondre avec la participation aux scrutins de la section Présence, qui ne
 * compte que les votes personnels (hors délégation).
 */
export const F_DEPUTE_PARTICIPATION_VOTES: FormulaLibProps = {
    label: "participation aux votes",
    result: "π_{d}",
    numerator: "Σ_{s ∈ E_{d}} 𝟙[v_{d,s} ∈ {pour, contre, abstention}]",
    denominator: "|E_{d}| − |N_{d}|",
    factor: "× 100",
    legend: [
        { symbol: "d", description: "ce député" },
        { symbol: "E_{d}", description: "scrutins publics de la législature tenus pendant son mandat (de sa prise de fonction à la fin de son mandat)" },
        { symbol: "v_{d,s}", description: "position de d au scrutin s, votée personnellement ou par délégation ; absente s'il n'a pas voté" },
        { symbol: "N_{d}", description: "scrutins où d ne pouvait pas voter : membre du Gouvernement, présidence de l'Assemblée ou présidence de la séance" },
    ],
    note:
        "L'open data ne liste que les votants et les non-votants déclarés : un député absent n'y figure pas. Le " +
        "dénominateur est donc reconstitué depuis son mandat. Une seule journée peut compter des centaines de " +
        "scrutins (amendements) : un taux de 20 à 30 % est courant.",
};

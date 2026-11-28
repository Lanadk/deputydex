import { FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";
import { L_A, L_P } from "@/app/(ui)/_shared/statistics/presence/presence-legende";

/**
 * Formule propre à la section « Présence » de la fiche groupe : la comparaison
 * avec l'Assemblée. Les autres (taux, composantes, mois, années d'un groupe) sont
 * celles des Chiffres clés, g fixé = ce groupe (`_shared/statistics/presence/presence-formules.ts`).
 */
export const F_GROUPE_COMPARAISON: FormulaLibProps = {
    label: "comparaison avec l'Assemblée",
    result: "τ_{X}",
    numerator: "Σ_{(d,j) ∈ X} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{(d,j) ∈ X} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: [
        { symbol: "X", description: "ce groupe (jours de ses membres, chacun compté dans le groupe où il était ce jour-là) ou toute l'Assemblée" },
        L_A,
        L_P,
    ],
    note: "Mêmes formules par composante (séance, commission, excusés, scrutins) que ci-dessus. Taux pondérés par les jours attendus, pas la moyenne des taux individuels.",
};

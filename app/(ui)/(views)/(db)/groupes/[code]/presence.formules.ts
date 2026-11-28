import { FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";
import { L_A, L_P } from "@/app/(ui)/_shared/statistics/presence-legende";

/**
 * Formules de la section « Présence » de la fiche groupe : celles des Chiffres
 * clés (`participation-presence.formules.ts`, g fixé = ce groupe), plus la
 * comparaison avec l'Assemblée.
 */
export {
    F_PRESENCE_GROUPE as F_GROUPE_TAUX,
    F_PRESENCE_GROUPE_SEANCE as F_GROUPE_SEANCE,
    F_PRESENCE_GROUPE_COMMISSION as F_GROUPE_COMMISSION,
    F_PRESENCE_GROUPE_SCRUTINS as F_GROUPE_SCRUTINS,
    F_PRESENCE_GROUPE_MOIS as F_GROUPE_TAUX_MOIS,
    F_PRESENCE_GROUPE_ANNEE as F_GROUPE_ANNEE_PARLEMENTAIRE,
} from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/participation-presence.formules";

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

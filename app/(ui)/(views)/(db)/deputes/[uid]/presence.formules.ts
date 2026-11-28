import { FormulaLegendItem, FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";
import { L_A, L_C, L_M, L_P, L_PC, L_PS, L_S, NOTE_BORNE_BASSE, NOTE_VOLUME } from "@/app/(ui)/_shared/statistics/presence-legende";

/**
 * Formules de la section « Présence » de la fiche député : celles des
 * Chiffres clés avec d FIXÉ (ce député), sommées sur ses seuls jours de la
 * législature affichée (agg_deputes_presence*). Le groupe et l'Assemblée du
 * graphique de comparaison suivent les formules pondérées des Chiffres clés.
 */

const L_DEPUTE: FormulaLegendItem = { symbol: "d", description: "ce député" };
const L_J: FormulaLegendItem = { symbol: "j", description: "un jour de la législature affichée" };
const BRIQUES_DEPUTE = [L_DEPUTE, L_J, L_M, L_S, L_C, L_A, L_PS, L_PC, L_P];

export const F_DEPUTE_TAUX: FormulaLibProps = {
    label: "taux de présence",
    result: "τ_{d}",
    numerator: "Σ_{j} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{j} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: BRIQUES_DEPUTE,
    note: NOTE_BORNE_BASSE,
};

export const F_DEPUTE_SEANCE: FormulaLibProps = {
    label: "présence en séance",
    result: "τ^{séance}_{d}",
    numerator: "Σ_{j} 𝟙[S_{j} ∧ M_{d,j} ∧ PS_{d,j}]",
    denominator: "Σ_{j} 𝟙[S_{j} ∧ M_{d,j}]",
    factor: "× 100",
    legend: [L_DEPUTE, L_J, L_M, L_S, L_PS],
};

export const F_DEPUTE_COMMISSION: FormulaLibProps = {
    label: "présence en commission",
    result: "τ^{commission}_{d}",
    numerator: "Σ_{r} 𝟙[présent_{d,r}]",
    denominator: "Σ_{r} 𝟙[convoqué_{d,r}]",
    factor: "× 100",
    legend: [
        L_DEPUTE,
        { symbol: "r", description: "une réunion à liste de présence (commission, délégation…) de la législature" },
        { symbol: "convoqué_{d,r}", description: "d est membre de l'organe à la date de la réunion r" },
        { symbol: "présent_{d,r}", description: "d est noté présent à r (même formule avec « excusé » pour le taux d'excusé)" },
    ],
    note: "Compté en réunions, pas en jours. Une présence à une réunion d'un organe dont il n'est pas membre compte comme jour de présence, pas dans ce taux.",
};

export const F_DEPUTE_SCRUTINS: FormulaLibProps = {
    label: "participation aux scrutins",
    result: "τ^{scrutins}_{d}",
    numerator: "Σ_{j} VP_{d,j}",
    denominator: "Σ_{j} 𝟙[M_{d,j}] · n_{j}",
    factor: "× 100",
    legend: [
        L_DEPUTE,
        L_J,
        L_M,
        { symbol: "VP_{d,j}", description: "votes personnels de d le jour j (pour, contre, abstention, hors délégation)" },
        { symbol: "n_{j}", description: "scrutins publics du jour j (une journée peut en compter des centaines)" },
    ],
};

export const F_DEPUTE_TAUX_MOIS: FormulaLibProps = {
    ...F_DEPUTE_TAUX,
    label: "taux de présence, par mois",
    result: "τ_{d,m}",
    numerator: "Σ_{j ∈ m} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{j ∈ m} 𝟙[A_{d,j}]",
    note: "Un mois sans jour attendu (août) n'a pas de point. " + NOTE_BORNE_BASSE,
};

export const F_DEPUTE_JOURS_MOIS: FormulaLibProps = {
    label: "jours de présence, par mois",
    result: "J_{d,m}",
    numerator: "Σ_{j ∈ m} 𝟙[P_{d,j}]",
    legend: [L_DEPUTE, L_J, L_PS, L_PC, L_P],
    note: NOTE_VOLUME,
};

export const F_DEPUTE_SOURCES: FormulaLibProps = {
    label: "jours de présence par source",
    result: "J^{source}_{d}",
    numerator: "Σ_{j} 𝟙[source le jour j]",
    legend: [
        L_DEPUTE,
        L_J,
        { symbol: "vote", description: "au moins un vote personnel ce jour-là" },
        { symbol: "parole", description: "au moins une prise de parole, une interruption ou une présidence de séance" },
        { symbol: "commission", description: "noté présent à au moins une réunion (membre ou non)" },
    ],
    note: "Un même jour peut cumuler plusieurs sources : la somme des trois dépasse le total des jours de présence, compté une fois par jour.",
};

export const F_DEPUTE_ANNEE_MANDAT: FormulaLibProps = {
    label: "jours de présence par mois, par année de mandat",
    result: "J_{d,k}",
    numerator: "Σ_{j ∈ Y_{d,k}} 𝟙[P_{d,j}]",
    denominator: "μ_{d,k}",
    legend: [
        L_DEPUTE,
        { symbol: "Y_{d,k}", description: "k-ième année de mandat de d : [t_{d} + (k − 1) ans ; t_{d} + k ans[" },
        { symbol: "t_{d}", description: "prise de fonction de d dans la législature" },
        { symbol: "μ_{d,k}", description: "mois actifs de l'année : avec au moins un jour attendu ou un jour de séance (août exclu)" },
        L_P,
    ],
    note: "Divisé par les mois actifs : une année de mandat entamée reste comparable à une année complète.",
};

export const F_COMPARAISON: FormulaLibProps = {
    label: "comparaison avec son groupe et l'Assemblée",
    result: "τ_{X}",
    numerator: "Σ_{(d,j) ∈ X} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{(d,j) ∈ X} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: [
        { symbol: "X", description: "ce député (d fixé), son groupe (jours de ses membres, chacun compté dans le groupe où il était ce jour-là) ou toute l'Assemblée" },
        L_A,
        L_P,
    ],
    note: "Mêmes formules par composante (séance, commission, excusés, scrutins) que ci-dessus. Groupe et Assemblée : taux pondérés, pas la moyenne des taux individuels.",
};

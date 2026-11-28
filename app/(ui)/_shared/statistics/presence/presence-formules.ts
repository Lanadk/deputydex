import { FormulaLegendItem, FormulaLibProps } from "@/app/(ui)/component-library/molecules/formula/formula-lib";
import { L_D_J, L_M, L_S, L_PS, mois, BRIQUES, BRIQUES_VOLUME, NOTE_BORNE_BASSE, NOTE_VOLUME } from "@/app/(ui)/_shared/statistics/presence/presence-legende";

/**
 * Formules EXACTES des indicateurs de présence (Assemblée, groupes, années),
 * partagées par les Chiffres clés (thème « Participation & présence ») et les
 * fiches groupe et député. Recopiées du SQL qui les calcule (deputydex-data) :
 * mv_deputes_presence_jour puis agg_assemblee_presence* et agg_groupes_presence*
 * (README : src/sql/scripts/presence/README.md). Toute évolution de ces vues doit
 * se refléter ici.
 *
 * Chaque formule porte sa légende complète : elle se lit seule, sous son
 * graphique. Notations : d un député, j un jour, m un mois, g un groupe,
 * 𝟙[…] vaut 1 si la condition est vraie, 0 sinon. Taux arrondis à 1 décimale.
 */

// ── Présence : vue d'ensemble ────────────────────────────────────────────────

export const F_PRESENCE_TAUX: FormulaLibProps = {
    label: "taux de présence",
    result: "τ",
    numerator: "Σ_{d,j} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{d,j} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: BRIQUES,
    note: "Somme sur tous les députés et tous les jours de la législature : un taux pondéré, pas la moyenne des taux individuels. " + NOTE_BORNE_BASSE,
};

export const F_PRESENCE_SEANCE: FormulaLibProps = {
    label: "présence en séance",
    result: "τ^{séance}",
    numerator: "Σ_{d,j} 𝟙[S_{j} ∧ M_{d,j} ∧ PS_{d,j}]",
    denominator: "Σ_{d,j} 𝟙[S_{j} ∧ M_{d,j}]",
    factor: "× 100",
    legend: [L_D_J, L_M, L_S, L_PS],
};

export const F_PRESENCE_COMMISSION: FormulaLibProps = {
    label: "présence en commission (et excusés)",
    result: "τ^{commission}",
    numerator: "Σ_{d,r} 𝟙[présent_{d,r}]",
    denominator: "Σ_{d,r} 𝟙[convoqué_{d,r}]",
    factor: "× 100",
    legend: [
        { symbol: "r", description: "une réunion à liste de présence (commission, délégation…)" },
        { symbol: "convoqué_{d,r}", description: "d est membre de l'organe à la date de la réunion r" },
        { symbol: "présent_{d,r}", description: "d est noté présent à r ; même formule avec « excusé » pour le taux d'excusés" },
    ],
    note: "Compté en réunions, pas en jours : deux réunions le même jour comptent deux fois. Les présents non membres (« Assistaient également ») ne sont pas au numérateur.",
};

export const F_PRESENCE_SCRUTINS: FormulaLibProps = {
    label: "participation aux scrutins",
    result: "τ^{scrutins}",
    numerator: "Σ_{d,j} VP_{d,j}",
    denominator: "Σ_{d,j} 𝟙[M_{d,j}] · n_{j}",
    factor: "× 100",
    legend: [
        L_D_J,
        L_M,
        { symbol: "VP_{d,j}", description: "votes personnels de d le jour j (hors délégation)" },
        { symbol: "n_{j}", description: "scrutins publics du jour j (une journée peut en compter des centaines)" },
    ],
};

export const F_PRESENCE_TAUX_MOIS: FormulaLibProps = {
    ...F_PRESENCE_TAUX,
    label: "taux de présence, par mois",
    result: "τ_{m}",
    numerator: "Σ_{d} Σ_{j ∈ m} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{d} Σ_{j ∈ m} 𝟙[A_{d,j}]",
    note: "Un mois sans séance avec scrutin (août) ne reflète que les commissions. " + NOTE_BORNE_BASSE,
};

export const F_PRESENCE_JOURS_MOIS: FormulaLibProps = {
    label: "jours de présence d'un député, par mois",
    result: "J_{m}",
    numerator: "Σ_{d} Σ_{j ∈ m} 𝟙[P_{d,j}]",
    denominator: "|D_{m}|",
    legend: [
        ...BRIQUES_VOLUME,
        { symbol: "D_{m}", description: "députés ayant au moins un jour attendu ou un jour de séance dans le mois m" },
    ],
    note: NOTE_VOLUME + " Le chiffre clé « jours de présence par mois » est la moyenne simple des J_{m} de la législature.",
};

// ── Présence : rythme ────────────────────────────────────────────────────────

export const F_PRESENCE_JOUR_SEMAINE: FormulaLibProps = {
    label: "taux par jour de la semaine",
    result: "τ_{w}",
    numerator: "Σ_{j : jour(j) = w} Σ_{d} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{j : jour(j) = w} Σ_{d} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: [{ symbol: "w", description: "un jour de la semaine (lundi … dimanche)" }, ...BRIQUES],
    note: "Jours de séance et jours de commission seule confondus.",
};

export const F_PRESENCE_JOUR_SEANCE: FormulaLibProps = {
    label: "courbe « en séance »",
    result: "τ^{séance}_{j}",
    numerator: "Σ_{d} 𝟙[M_{d,j} ∧ PS_{d,j}]",
    denominator: "Σ_{d} 𝟙[M_{d,j}]",
    factor: "× 100, pour S_{j} = 1",
    legend: [L_D_J, L_M, L_S, L_PS],
};

export const F_PRESENCE_JOUR_TOUS_LIEUX: FormulaLibProps = {
    label: "courbe « séance ou commission »",
    result: "τ_{j}",
    numerator: "Σ_{d} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{d} 𝟙[A_{d,j}]",
    factor: "× 100, pour S_{j} = 1",
    legend: BRIQUES,
    note: "Les jours de commission seule (S_{j} = 0) ne sont pas tracés : seuls les membres convoqués y sont attendus, leur taux ne se compare pas à celui d'une séance.",
};

export const F_PRESENCE_DEPUTES_PRESENTS: FormulaLibProps = {
    label: "nombre de député·es présent·es",
    result: "N_{j}",
    numerator: "Σ_{d} 𝟙[P_{d,j}]",
    legend: [...BRIQUES_VOLUME, L_S],
    note: "Attendus ou non, chaque député compté une fois, pour S_{j} = 1.",
};

// ── Présence : groupes ───────────────────────────────────────────────────────

const L_GROUPE: FormulaLegendItem = {
    symbol: "g(d,j)",
    description: "groupe politique de d le jour j (mandat de groupe en cours ce jour-là) : un député qui change de groupe compte pour chacun sur sa période",
};

export const F_PRESENCE_GROUPE: FormulaLibProps = {
    label: "taux de présence d'un groupe",
    result: "τ_{g}",
    numerator: "Σ_{(d,j) : g(d,j) = g} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{(d,j) : g(d,j) = g} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: [L_GROUPE, ...BRIQUES],
    note: "Non inscrits exclus du classement.",
};

export const F_PRESENCE_GROUPE_SEANCE: FormulaLibProps = {
    label: "présence en séance d'un groupe",
    result: "τ^{séance}_{g}",
    numerator: "Σ_{(d,j) : g(d,j) = g} 𝟙[S_{j} ∧ M_{d,j} ∧ PS_{d,j}]",
    denominator: "Σ_{(d,j) : g(d,j) = g} 𝟙[S_{j} ∧ M_{d,j}]",
    factor: "× 100",
    legend: [L_GROUPE, L_D_J, L_M, L_S, L_PS],
    note: "Les commissions ne comptent pas : seuls les jours de séance avec au moins un scrutin public.",
};

const L_REUNION: FormulaLegendItem = { symbol: "r", description: "une réunion à liste de présence (commission, délégation…)" };
const L_CONVOQUE: FormulaLegendItem = { symbol: "convoqué_{d,r}", description: "d est membre de l'organe à la date de la réunion r" };
const L_GROUPE_REUNION: FormulaLegendItem = { symbol: "g(d,r)", description: "groupe politique de d le jour de la réunion r" };

export const F_PRESENCE_GROUPE_COMMISSION: FormulaLibProps = {
    label: "présence en commission d'un groupe",
    result: "τ^{commission}_{g}",
    numerator: "Σ_{(d,r) : g(d,r) = g} 𝟙[présent_{d,r}]",
    denominator: "Σ_{(d,r) : g(d,r) = g} 𝟙[convoqué_{d,r}]",
    factor: "× 100",
    legend: [L_GROUPE_REUNION, L_REUNION, L_CONVOQUE, { symbol: "présent_{d,r}", description: "d est noté présent à r" }],
    note: "Compté en réunions, pas en jours. Les présents non membres (« Assistaient également ») ne sont pas au numérateur.",
};

export const F_PRESENCE_GROUPE_EXCUSES: FormulaLibProps = {
    label: "excusés en commission d'un groupe",
    result: "ε_{g}",
    numerator: "Σ_{(d,r) : g(d,r) = g} 𝟙[excusé_{d,r}]",
    denominator: "Σ_{(d,r) : g(d,r) = g} 𝟙[convoqué_{d,r}]",
    factor: "× 100",
    legend: [L_GROUPE_REUNION, L_REUNION, L_CONVOQUE, { symbol: "excusé_{d,r}", description: "d est noté excusé à r" }],
    note: "Présents + excusés + absents = convoqués : un excusé compte comme non présent dans le taux de présence en commission.",
};

export const F_PRESENCE_GROUPE_SCRUTINS: FormulaLibProps = {
    label: "participation aux scrutins d'un groupe",
    result: "τ^{scrutins}_{g}",
    numerator: "Σ_{(d,j) : g(d,j) = g} VP_{d,j}",
    denominator: "Σ_{(d,j) : g(d,j) = g} 𝟙[M_{d,j}] · n_{j}",
    factor: "× 100",
    legend: [
        L_GROUPE,
        L_D_J,
        L_M,
        { symbol: "VP_{d,j}", description: "votes personnels de d le jour j (pour, contre, abstention, hors délégation)" },
        { symbol: "n_{j}", description: "scrutins publics du jour j (une journée peut en compter des centaines)" },
    ],
    note: "Bien plus bas que la présence en séance : être là un jour ne veut pas dire voter chacun des scrutins du jour.",
};

export const F_PRESENCE_GROUPE_JOURS: FormulaLibProps = {
    label: "jours de présence par mois d'un groupe",
    result: "J_{g}",
    numerator: "Σ_{(d,j) : g(d,j) = g} 𝟙[P_{d,j}]",
    denominator: "Σ_{d} μ_{d,g}",
    legend: [L_GROUPE, ...BRIQUES_VOLUME, mois("μ_{d,g}", "passés dans le groupe g")],
    note: NOTE_VOLUME,
};

export const F_PRESENCE_GROUPE_MOIS: FormulaLibProps = {
    ...F_PRESENCE_GROUPE,
    label: "taux de présence d'un groupe, par mois",
    result: "τ_{g,m}",
    numerator: "Σ_{(d,j) : g(d,j) = g, j ∈ m} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{(d,j) : g(d,j) = g, j ∈ m} 𝟙[A_{d,j}]",
    note: "Un groupe renommé ou dissous en cours de législature a sa propre courbe, sur sa période.",
};

export const F_PRESENCE_GROUPE_ANNEE: FormulaLibProps = {
    ...F_PRESENCE_GROUPE_JOURS,
    label: "jours de présence par mois d'un groupe, par année parlementaire",
    result: "J_{g,a}",
    numerator: "Σ_{(d,j) : g(d,j) = g, j ∈ a} 𝟙[P_{d,j}]",
    denominator: "Σ_{d} μ_{d,g,a}",
    legend: [
        { symbol: "a", description: "année parlementaire : 1er octobre → 30 septembre" },
        L_GROUPE,
        ...BRIQUES_VOLUME,
        mois("μ_{d,g,a}", "passés dans le groupe g pendant l'année a"),
    ],
};

// ── Présence : années ────────────────────────────────────────────────────────

/** Années toutes législatures confondues (graphes « Présence par année » des Chiffres clés). */
const L_TOUTES: FormulaLegendItem = {
    symbol: "Σ_{d}",
    description: "somme sur tous les députés de toutes les législatures (un député de deux législatures compte dans chacune)",
};

const NOTE_TOUTES =
    "Toutes législatures confondues : une année coupée par un changement de législature est calculée sur l'année " +
    "entière, en sommant les jours des deux — jamais en moyennant leurs taux. Le repère vertical marque le début " +
    "de chaque législature.";

export const F_PRESENCE_ANNEE_PARLEMENTAIRE: FormulaLibProps = {
    label: "taux par année parlementaire",
    result: "τ_{a}",
    numerator: "Σ_{d} Σ_{j ∈ a} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{d} Σ_{j ∈ a} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: [
        { symbol: "a", description: "année parlementaire : 1er octobre → 30 septembre" },
        L_TOUTES,
        ...BRIQUES,
    ],
    note: NOTE_TOUTES,
};

export const F_PRESENCE_ANNEE_MANDAT: FormulaLibProps = {
    label: "taux par année de mandat",
    result: "τ_{k}",
    numerator: "Σ_{d} Σ_{j ∈ Y_{d,k}} 𝟙[A_{d,j} ∧ P_{d,j}]",
    denominator: "Σ_{d} Σ_{j ∈ Y_{d,k}} 𝟙[A_{d,j}]",
    factor: "× 100",
    legend: [
        { symbol: "Y_{d,k}", description: "k-ième année de mandat de d : [t_{d} + (k − 1) ans ; t_{d} + k ans[" },
        { symbol: "t_{d}", description: "première prise de fonction de d dans la législature (un remplaçant a la sienne)" },
        ...BRIQUES,
    ],
    note: "Regroupé par rang d'année, pas par date : « année 1 » rassemble les 12 premiers mois de chaque député.",
};

export const F_PRESENCE_ANNEE_CIVILE: FormulaLibProps = {
    label: "jours de présence par mois, par année civile",
    result: "J_{a}",
    numerator: "Σ_{d} Σ_{j ∈ a} 𝟙[P_{d,j}]",
    denominator: "Σ_{d} μ_{d,a}",
    legend: [
        { symbol: "a", description: "année civile : 1er janvier → 31 décembre" },
        L_TOUTES,
        ...BRIQUES_VOLUME,
        mois("μ_{d,a}", "dans l'année a"),
    ],
    note: NOTE_VOLUME + " Divisé par les mois actifs plutôt que par 12 : une année entamée (ou un député arrivé en cours d'année) reste comparable à une année complète. " + NOTE_TOUTES,
};

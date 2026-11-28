import { FormulaLegendItem } from "@/app/(ui)/component-library/molecules/formula/formula-lib";

/**
 * Légende commune des formules de présence (mv_deputes_presence_jour de
 * deputydex-data, README : src/sql/scripts/presence/README.md), partagée par
 * les Chiffres clés et la fiche député. Toute évolution des règles de la vue
 * doit se refléter ici.
 */

// ── Briques de la présence (mv_deputes_presence_jour) ────────────────────────

export const L_D_J: FormulaLegendItem = { symbol: "d, j", description: "un député et un jour de la législature choisie" };
export const L_M: FormulaLegendItem = { symbol: "M_{d,j}", description: "1 si d est en mandat le jour j (de sa prise de fonction à la fin de son mandat ; un député devenu ministre ne l'est plus)" };
export const L_S: FormulaLegendItem = { symbol: "S_{j}", description: "1 si j est un jour de séance observable : une séance s'est tenue (compte rendu publié ou scrutin) ET au moins un scrutin public a eu lieu" };
export const L_C: FormulaLegendItem = { symbol: "C_{d,j}", description: "1 si d est convoqué le jour j à une réunion à liste de présence d'un organe (commission…) dont il est membre" };
export const L_A: FormulaLegendItem = { symbol: "A_{d,j}", description: "jour attendu : (S_{j} ∧ M_{d,j}) ∨ C_{d,j}" };
export const L_PS: FormulaLegendItem = { symbol: "PS_{d,j}", description: "présent en séance : au moins un vote personnel (hors délégation), une prise de parole, une interruption ou une présidence de séance" };
export const L_PC: FormulaLegendItem = { symbol: "PC_{d,j}", description: "présent en commission : noté présent à une réunion ce jour-là, membre de l'organe ou non" };
export const L_P: FormulaLegendItem = { symbol: "P_{d,j}", description: "jour de présence : PS_{d,j} ∨ PC_{d,j}" };
export const mois = (symbol: string, periode: string): FormulaLegendItem => ({
    symbol,
    description: `mois actifs de d ${periode} : mois où il a au moins un jour attendu ou un jour de séance (août, sans séance ni réunion, n'en est pas un)`,
});

/** Légende du taux de présence (attendu / présent). */
export const BRIQUES = [L_D_J, L_M, L_S, L_C, L_A, L_PS, L_PC, L_P];
/** Légende d'un volume de présence (pas d'attendu au numérateur). */
export const BRIQUES_VOLUME = [L_D_J, L_PS, L_PC, L_P];

export const NOTE_BORNE_BASSE =
    "Borne basse : un député assis dans l'hémicycle qui ne vote ni ne parle n'est pas vu. Les séances sans aucun " +
    "scrutin (questions au Gouvernement, semaines de contrôle) ne sont pas attendues — on n'y voit que les orateurs — " +
    "mais y parler compte comme jour de présence (P_{d,j} sans A_{d,j}).";

export const NOTE_VOLUME = "Toutes sources, jours attendus ou non, un jour compté une fois même si le député a voté, parlé et siégé en commission.";

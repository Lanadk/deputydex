/**
 * Les trois « types » des tuiles statistiques, pris dans la palette P1 :
 * blanc, rouge, bleu (en nuances, pas les couleurs vives de P2). Chaque type a
 * un accent (bandeau, halo, bordure ; fond teinté via color-mix) et une encre
 * lisible sur la tuile comme sur ce fond teinté, dans les trois thèmes
 * (`--stat-type-*` et `--stat-type-*-ink` dans `globals.css`).
 */
export type TypeStat = "blanc" | "rouge" | "bleu";

export const TYPES_STAT: TypeStat[] = ["blanc", "rouge", "bleu"];

/** Accent du type : bandeau, halo, bordure, fond teinté (color-mix). */
export const typeStatCouleur = (type: TypeStat) => `var(--stat-type-${type})`;

/** Encre du type : icône et texte, sur la tuile ou sur son fond teinté. */
export const typeStatEncre = (type: TypeStat) => `var(--stat-type-${type}-ink)`;

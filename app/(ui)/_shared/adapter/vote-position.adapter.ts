/**
 * Couleurs des positions de vote ("pour", "contre", "abstention", "non_votant", "absent"),
 * tirées des tokens du design system (globals.css, section « Votes » de chaque thème) :
 * elles suivent les thèmes clair / sombre / accessible.
 *
 * Deux jeux, volontairement distincts :
 * - tableaux, barres, textes (--vote-*) : vert = pour, rouge = contre, olive = abstention ;
 * - hémicycle (--vote-hemicycle-*) : bleu = pour, rouge = contre, jaune = abstention,
 *   comme les graphiques (--chart-1/2/3), plus lisibles sur le plan 3D.
 * Dans les deux : non-votant (présent sans prendre part au vote, ex. présidence de
 * séance) et absent en gris.
 */
const TABLE_TOKENS: Record<string, string> = {
    pour: "var(--vote-pour)",
    contre: "var(--vote-contre)",
    abstention: "var(--vote-abstention)",
    non_votant: "var(--vote-non-votant)",
    absent: "var(--vote-absent)",
};

const HEMICYCLE_TOKENS: Record<string, string> = {
    pour: "var(--vote-hemicycle-pour)",
    contre: "var(--vote-hemicycle-contre)",
    abstention: "var(--vote-hemicycle-abstention)",
    non_votant: "var(--vote-non-votant)",
    absent: "var(--vote-absent)",
};

/** Couleur d'une position dans un tableau, une barre ou un texte. */
export function votePositionColor(position: string | null): string | undefined {
    return position ? TABLE_TOKENS[position] : undefined;
}

/** Couleur d'un siège de l'hémicycle selon la position de son député. */
export function hemicycleSeatColor(position: string | null): string | undefined {
    return position ? HEMICYCLE_TOKENS[position] : undefined;
}

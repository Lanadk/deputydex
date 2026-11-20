/**
 * Couleurs des positions de vote ("pour", "contre", "abstention", "non_votant", "absent").
 *
 * Deux palettes, volontairement distinctes :
 * - tableaux, barres et textes : vert = pour, rouge = contre, orange = abstention ;
 * - hémicycle : bleu = pour, rouge = contre, jaune = abstention, plus lisible
 *   sur le plan 3D, où le vert se confond avec le fond.
 * Dans les deux : gris foncé = non-votant (présent mais ne prend pas part au vote,
 * ex. présidence de séance), gris clair = absent.
 */
const TABLE_COLORS: Record<string, string> = {
    pour: "#22c55e",
    contre: "#ef4444",
    abstention: "#f59e0b",
    non_votant: "#64748b",
    absent: "#d1d5db",
};

const HEMICYCLE_COLORS: Record<string, string> = {
    pour: "#2563eb",
    contre: "#dc2626",
    abstention: "#eab308",
    non_votant: "#64748b",
    absent: "#d1d5db",
};

/** Couleur d'une position dans un tableau, une barre ou un texte. */
export function votePositionColor(position: string | null): string | undefined {
    return position ? TABLE_COLORS[position] : undefined;
}

/** Couleur d'un siège de l'hémicycle selon la position de son député. */
export function hemicycleSeatColor(position: string | null): string | undefined {
    return position ? HEMICYCLE_COLORS[position] : undefined;
}

/**
 * Couleur d'affichage d'une position sur les pages scrutins :
 * bleu = pour, rouge = contre, jaune = abstention, gris = absent,
 * gris foncé = non-votant (présent mais ne prend pas part au vote, ex. présidence de séance).
 */
const VOTE_POSITION_COLORS: Record<string, string> = {
    pour: "#2563eb",
    contre: "#dc2626",
    abstention: "#eab308",
    non_votant: "#64748b",
    absent: "#d1d5db",
};

export function votePositionColor(position: string | null): string | undefined {
    return position ? VOTE_POSITION_COLORS[position] : undefined;
}

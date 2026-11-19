/** Couleur d'affichage d'une position de vote ("pour", "contre", "abstention", "non_votant"). */
const VOTE_POSITION_COLORS: Record<string, string> = {
    pour: "#22c55e",
    contre: "#ef4444",
    abstention: "#f59e0b",
    non_votant: "#94a3b8",
};

export function votePositionColor(position: string | null): string | undefined {
    return position ? VOTE_POSITION_COLORS[position] : undefined;
}

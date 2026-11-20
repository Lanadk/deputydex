/**
 * Position d'un vote (voir GLOSSARY.md), telle qu'elle est stockée en base
 * (`votes_deputes.position`, `scrutins_groupes.position_majoritaire`).
 */
export type VotePosition = "pour" | "contre" | "abstention" | "non_votant";

const VOTE_POSITION_LABELS: Record<VotePosition, string> = {
    pour: "Pour",
    contre: "Contre",
    abstention: "Abstention",
    non_votant: "Non-votant",
};

/** Positions exprimées : celles qui comptent pour comparer un député à son groupe. */
const POSITIONS_EXPRIMEES: ReadonlySet<string> = new Set<VotePosition>(["pour", "contre", "abstention"]);

/** Libellé lisible d'une position ; une valeur inconnue est renvoyée telle quelle plutôt que masquée. */
export function votePositionLabel(position: string): string {
    return VOTE_POSITION_LABELS[position as VotePosition] ?? position;
}

/**
 * Vote rebelle : le député a exprimé une position (pour / contre / abstention)
 * différente de la position majoritaire de son groupe sur ce scrutin.
 * Ne pas voter n'est pas un vote rebelle.
 */
export function isVoteRebelle(position: string, groupePosition: string | null): boolean {
    return groupePosition !== null && POSITIONS_EXPRIMEES.has(position) && position !== groupePosition;
}

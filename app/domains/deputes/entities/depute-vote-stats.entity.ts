export type DeputeVoteStatsEntity = {
    total_votes: number;
    total_pour: number;
    total_contre: number;
    total_abstentions: number;
    total_non_votants: number;
    total_rebel: number;
    taux_fidelite: number | null;
    taux_participation: number | null;
};

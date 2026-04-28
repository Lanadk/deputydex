export type DeputeVoteStatsDTO = {
    totalVotes: number;
    totalPour: number;
    totalContre: number;
    totalAbstentions: number;
    totalNonVotants: number;
    rebelVotesCount: number;
    tauxFidelite: number | null;
    tauxParticipation: number | null;
};

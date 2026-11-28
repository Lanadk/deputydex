export type DeputeVoteStatsDTO = {
    totalVotes: number;
    totalPour: number;
    totalContre: number;
    totalAbstentions: number;
    totalNonVotants: number;
    rebelVotesCount: number;
    tauxFidelite: number | null;
    /** % des scrutins où il pouvait voter (délégations comprises), à une décimale. */
    tauxParticipation: number | null;
    /** Scrutins tenus pendant son mandat, moins ceux où il ne pouvait pas voter. */
    scrutinsVotables: number;
    /** Pour + contre + abstention, délégations comprises. */
    votesExprimes: number;
    votesParDelegation: number;
};

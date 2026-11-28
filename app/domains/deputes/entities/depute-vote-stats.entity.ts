/** Ligne de `agg_deputes_stats_votes` (deputydex-data) ; les COUNT arrivent en bigint ou en number. */
export type DeputeVoteStatsEntity = {
    total_votes: number | bigint;
    total_pour: number | bigint;
    total_contre: number | bigint;
    total_abstentions: number | bigint;
    total_non_votants: number | bigint;
    total_rebel: number | bigint;
    taux_fidelite: number | string | null;
    /** Votes exprimés ÷ (scrutins tenus pendant le mandat − non-votes statutaires). */
    taux_participation: number | string | null;
    /** Scrutins publics tenus pendant son mandat. */
    scrutins_mandat: number;
    /** Scrutins où il ne pouvait pas voter : membre du Gouvernement, présidence de l'Assemblée ou de séance. */
    non_votants_statutaires: number;
    /** Pour + contre + abstention, délégations comprises. */
    votes_exprimes: number;
    votes_par_delegation: number;
};

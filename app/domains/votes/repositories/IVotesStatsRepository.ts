import { VotePositionsTotalsEntity } from "@/app/domains/votes/entities/vote-positions-totals.entity";

export interface IVotesStatsRepository {
    /** Somme des positions de vote (pour/contre/abstention/non-votant) sur l'ensemble des scrutins recensés. */
    getPositionsTotals(): Promise<VotePositionsTotalsEntity>;

    /** Cumul de tous les votes individuels (pour+contre+abstention+non-votant), une législature donnée — le nombre de VOTES, pas de scrutins (voir IScrutinsStatsRepository.countScrutins). */
    countVotes(legislature: number): Promise<number>;
}

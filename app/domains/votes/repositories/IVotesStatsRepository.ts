import { VotePositionsTotalsEntity } from "@/app/domains/votes/entities/vote-positions-totals.entity";

export interface IVotesStatsRepository {
    /** Somme des positions de vote (pour/contre/abstention/non-votant) sur l'ensemble des scrutins recensés. */
    getPositionsTotals(): Promise<VotePositionsTotalsEntity>;

    /**
     * Cumul de tous les votes individuels (pour+contre+abstention+non-votant)
     * — le nombre de VOTES, pas de scrutins (voir
     * IScrutinsStatsRepository.countScrutins). `legislature` omise = toutes
     * législatures confondues : le domaine "votes" n'a pas d'EntityResolver
     * (voir ENTITY_RESOLVERS), donc pas de filtre législature disponible en
     * mode Statistiques avancées — cette stat doit rester utilisable seule.
     */
    countVotes(legislature?: number): Promise<number>;
}

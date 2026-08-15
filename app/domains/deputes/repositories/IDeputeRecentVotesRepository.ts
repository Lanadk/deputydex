import { DeputeRecentVoteEntity } from "@/app/domains/deputes/entities/depute-recent-vote.entity";

export interface IDeputeRecentVotesRepository {
    getDeputeRecentVotes(uid: string, legislature: number, limit: number): Promise<DeputeRecentVoteEntity[]>;
}

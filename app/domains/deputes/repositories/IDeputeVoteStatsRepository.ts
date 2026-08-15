import { DeputeVoteStatsEntity } from "@/app/domains/deputes/entities/depute-vote-stats.entity";

export interface IDeputeVoteStatsRepository {
    getDeputeVoteStats(uid: string, legislature: number): Promise<DeputeVoteStatsEntity | null>;
}

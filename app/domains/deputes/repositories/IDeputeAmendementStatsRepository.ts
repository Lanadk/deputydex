import { DeputeAmendementStatsEntity } from "@/app/domains/deputes/entities/depute-amendement-stats.entity";

export interface IDeputeAmendementStatsRepository {
    getDeputeAmendementStats(uid: string, legislature: number): Promise<DeputeAmendementStatsEntity | null>;
}

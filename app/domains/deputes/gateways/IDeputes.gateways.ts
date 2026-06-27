import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { DeputeAmendementStatsDTO } from "@/app/domains/deputes/dto/depute-amendement-stats.dto";
import { DeputeListItemDTO } from "@/app/domains/deputes/dto/depute-list-item.dto";

export interface IDeputesGateways {
    getDeputesList(legislature: number): Promise<DeputeListItemDTO[]>;
    getDeputeIdentity(uid: string, legislature: number): Promise<DeputeIdentityDTO>;
    getDeputeMandats(uid: string): Promise<DeputeMandatDTO[]>;
    getDeputeVoteStats(uid: string, legislature: number): Promise<DeputeVoteStatsDTO>;
    getDeputeRecentVotes(uid: string, legislature: number): Promise<DeputeRecentVoteDTO[]>;
    getDeputeAmendementStats(uid: string, legislature: number): Promise<DeputeAmendementStatsDTO>;
}

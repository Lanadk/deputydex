import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeVoteStatsDTO } from "@/app/domains/deputes/dto/depute-vote-stats.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { DeputeAmendementStatsDTO } from "@/app/domains/deputes/dto/depute-amendement-stats.dto";
import { DeputeListItemDTO } from "@/app/domains/deputes/dto/depute-list-item.dto";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { DeputeActivityDTO } from "@/app/domains/deputes/dto/depute-activity.dto";
import { DeputeActivityDetailsDTO } from "@/app/domains/deputes/dto/depute-activity-details.dto";
import { DeputesAgeExtremesDTO } from "@/app/domains/deputes/dto/deputes-age-extremes.dto";

export interface IDeputesGateways {
    getDeputesList(legislature: number): Promise<DeputeListItemDTO[]>;
    getDeputesCards(legislature: number): Promise<DeputesCardDTO[]>;
    getDeputeActivityCalendar(uid: string, legislature: number): Promise<DeputeActivityDTO>;
    getDeputeActivityCalendarDetails(uid: string, legislature: number, date: string): Promise<DeputeActivityDetailsDTO[]>;
    getDeputeIdentity(uid: string, legislature: number): Promise<DeputeIdentityDTO>;
    getDeputeLegislatures(uid: string): Promise<number[]>;
    getDeputeMandats(uid: string): Promise<DeputeMandatDTO[]>;
    getDeputeVoteStats(uid: string, legislature: number): Promise<DeputeVoteStatsDTO>;
    getDeputeRecentVotes(uid: string, legislature: number): Promise<DeputeRecentVoteDTO[]>;
    getDeputeAmendementStats(uid: string, legislature: number): Promise<DeputeAmendementStatsDTO>;
    getDeputesAgeExtremes(legislature: number): Promise<DeputesAgeExtremesDTO>;
}

import { VotePositionsTotalsEntity } from "@/app/domains/votes/entities/vote-positions-totals.entity";
import { VotePositionsStatDTO } from "@/app/domains/votes/dto/vote-positions-stat.dto";

export function mapVotePositionsStatToDTO(entity: VotePositionsTotalsEntity): VotePositionsStatDTO {
    return {
        items: [
            { label: "Pour", value: entity.total_pour },
            { label: "Contre", value: entity.total_contre },
            { label: "Abstention", value: entity.total_abstentions },
            { label: "Non-votant", value: entity.total_non_votants },
        ],
    };
}

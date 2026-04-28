import { DeputeRecentVoteEntity } from "@/app/domains/deputes/entities/depute-recent-vote.entity";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";

export function mapDeputeRecentVoteEntityToDTO(entity: DeputeRecentVoteEntity): DeputeRecentVoteDTO {
    return {
        scrutinUid: entity.scrutin_uid,
        titre: entity.titre,
        date: entity.date_scrutin?.toISOString() ?? null,
        position: entity.position,
        groupePosition: entity.groupe_position,
        isRebel:
            entity.groupe_position !== null &&
            entity.position !== entity.groupe_position &&
            entity.position !== 'nonVotant',
    };
}

export function mapDeputeRecentVotesEntitiesToDTOs(entities: DeputeRecentVoteEntity[]): DeputeRecentVoteDTO[] {
    return entities.map(mapDeputeRecentVoteEntityToDTO);
}

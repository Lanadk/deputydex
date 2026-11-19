import { DeputeRecentVoteEntity } from "@/app/domains/deputes/entities/depute-recent-vote.entity";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { anScrutinUrl } from "@/app/_shared/utils/assemblee-nationale";

export function mapDeputeRecentVoteEntityToDTO(entity: DeputeRecentVoteEntity, legislature: number): DeputeRecentVoteDTO {
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
        lienAN: entity.scrutin_numero ? anScrutinUrl(legislature, entity.scrutin_numero) : null,
    };
}

export function mapDeputeRecentVotesEntitiesToDTOs(entities: DeputeRecentVoteEntity[], legislature: number): DeputeRecentVoteDTO[] {
    return entities.map((e) => mapDeputeRecentVoteEntityToDTO(e, legislature));
}

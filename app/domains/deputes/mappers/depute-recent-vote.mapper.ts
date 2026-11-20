import { DeputeRecentVoteEntity } from "@/app/domains/deputes/entities/depute-recent-vote.entity";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { anScrutinUrl } from "@/app/_shared/utils/assemblee-nationale";
import { isVoteRebelle } from "@/app/domains/votes/vote-position";

export function mapDeputeRecentVoteEntityToDTO(entity: DeputeRecentVoteEntity, legislature: number): DeputeRecentVoteDTO {
    return {
        scrutinUid: entity.scrutin_uid,
        titre: entity.titre,
        date: entity.date_scrutin?.toISOString() ?? null,
        position: entity.position,
        groupePosition: entity.groupe_position,
        // Même règle que la fiche scrutin (domaine votes) : ne pas voter n'est pas un vote rebelle.
        isRebel: isVoteRebelle(entity.position, entity.groupe_position),
        lienAN: entity.scrutin_numero ? anScrutinUrl(legislature, entity.scrutin_numero) : null,
    };
}

export function mapDeputeRecentVotesEntitiesToDTOs(entities: DeputeRecentVoteEntity[], legislature: number): DeputeRecentVoteDTO[] {
    return entities.map((e) => mapDeputeRecentVoteEntityToDTO(e, legislature));
}

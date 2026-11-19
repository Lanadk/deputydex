import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";
import { ScrutinDeputeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-depute-vote.dto";
import { isVoteRebelle, votePositionLabel } from "@/app/domains/scrutins/vote-position";

export function mapScrutinDeputeVoteEntityToDTO(entity: ScrutinDeputeVoteEntity): ScrutinDeputeVoteDTO {
    const nomComplet = [entity.prenom, entity.nom].filter(Boolean).join(" ") || entity.depute_uid;
    return {
        deputeUid: entity.depute_uid,
        nomComplet,
        nom: entity.nom ?? nomComplet,
        groupeCode: entity.groupe_code,
        groupeLabel: entity.groupe_label ?? entity.groupe_code,
        position: entity.position,
        positionLabel: votePositionLabel(entity.position),
        groupePosition: entity.groupe_position,
        groupePositionLabel: entity.groupe_position ? votePositionLabel(entity.groupe_position) : null,
        isRebelle: isVoteRebelle(entity.position, entity.groupe_position),
        parDelegation: entity.par_delegation === true,
    };
}

export function mapScrutinDeputeVotesEntitiesToDTOs(entities: ScrutinDeputeVoteEntity[]): ScrutinDeputeVoteDTO[] {
    return entities.map(mapScrutinDeputeVoteEntityToDTO);
}

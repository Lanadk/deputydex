import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";
import { ScrutinGroupeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-groupe-vote.dto";
import { votePositionLabel } from "@/app/domains/votes/vote-position";

export function mapScrutinGroupeVoteEntityToDTO(entity: ScrutinGroupeVoteEntity): ScrutinGroupeVoteDTO {
    return {
        groupeCode: entity.groupe_code,
        groupeLabel: entity.groupe_label ?? entity.groupe_code,
        nombreMembres: entity.nombre_membres,
        pour: entity.pour ?? 0,
        contre: entity.contre ?? 0,
        abstentions: entity.abstentions ?? 0,
        nonVotants: entity.non_votants ?? 0,
        positionMajoritaire: entity.position_majoritaire,
        positionMajoritaireLabel: entity.position_majoritaire ? votePositionLabel(entity.position_majoritaire) : null,
    };
}

export function mapScrutinGroupeVotesEntitiesToDTOs(entities: ScrutinGroupeVoteEntity[]): ScrutinGroupeVoteDTO[] {
    return entities.map(mapScrutinGroupeVoteEntityToDTO);
}

import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";
import {GroupeCardEntity} from "@/app/domains/groupes/entities/groupe-card.entity";

export function mapGroupeCardRowEntityToGroupeCardDTO(legislature: number, entity: GroupeCardEntity): GroupeCardDTO {
    return {
        groupeId: entity.groupe_id,
        groupeCode: entity.groupe_code ?? '',
        groupeLabel: entity.groupe_label ?? '',
        groupePresidentFullName: entity.groupe_president_full_name ?? '',
        groupeQualitySexLabel: entity.groupe_label_type_sex ?? '',
        groupeCountMembers: Number(entity.groupe_count_members),
        groupeHref: `/groupes/${entity.groupe_code}`,
        groupeImg: entity.groupe_code?.includes('NI') ? null : `/tribun/${legislature}/logos_groupes/${entity.groupe_code}.png`,
        // TODO color + position
    }
}

export function mapEntityToDTO(
    legislature: number,
    list: GroupeCardEntity[]
): GroupeCardDTO[] {
    return list.map((entity) =>
        mapGroupeCardRowEntityToGroupeCardDTO(legislature, entity)
    );
}


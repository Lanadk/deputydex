import {GroupeCardDTO} from "@/app/domains/groupes/dto/groupes-card.dto";

export function mapGroupeCardRowEntityToGroupeCardDTO(legislature: number, row: any): GroupeCardDTO {
    return {
        groupeId: row.groupe_id,
        groupeCode: row.groupe_code,
        groupeLabel: row.groupe_label,
        groupePresidentFullName: row.groupe_president_full_name,
        groupeQualitySexLabel: row.groupe_label_type_sex,
        groupeCountMembers: Number(row.groupe_count_members),
        groupeHref: `/groupes/${row.groupe_code}`,
        groupeImg: row.groupe_code.includes('NI') ? null : `/tribun/${legislature}/logos_groupes/${row.groupe_code}.png`,
        // TODO color + position
    }
}

export function mapRowsToDTO(
    legislature: number,
    list: any[]
): GroupeCardDTO[] {
    return list.map((row) =>
        mapGroupeCardRowEntityToGroupeCardDTO(legislature, row)
    );
}


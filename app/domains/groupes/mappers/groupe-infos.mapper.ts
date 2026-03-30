import {GroupeInfosRow} from "@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";


export function mapEntityToGroupeInfosDTO(legislature: number, entities: GroupeInfosRow[]): GroupeInfosDTO {
    const row = entities?.[0];

    return {
        legislature: row.legislature,
        groupeLabel: row.groupe_label,
        groupeCode: row.groupe_code,
        groupePosition: row.groupe_position,
        groupeCountMembers: Number(row.groupe_count_members),
        groupeRank: row.groupe_rank,
        groupeYearOfCreation: row.groupe_year_of_creation,
        groupeWebSite: row.groupe_web_site,
        groupeImg: `/tribun/${legislature}/logos_groupes/${row.groupe_code}.png`,
        groupePresidentFullName: row.groupe_president_full_name,
        groupeQualitySexLabel: row.groupe_quality_sex_label,
        groupeSeatsSharePercent: Number(row.groupe_seats_share_percent),
    };
}
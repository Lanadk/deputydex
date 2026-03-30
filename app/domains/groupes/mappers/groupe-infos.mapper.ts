import {GroupeInfosRow} from "@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";


export function mapEntityToGroupeInfosDTO(legislature: number, entity: GroupeInfosRow): GroupeInfosDTO {
    return {
        groupeLabel: entity.groupe_label,
        groupeCode: entity.groupe_code,
        groupePosition: entity.groupe_position,
        groupeCountMembers: Number(entity.groupe_count_members),
        groupeRank: entity.groupe_rank,
        groupeYearOfCreation: entity.groupe_year_of_creation,
        groupeWebSite: entity.groupe_web_site,
        groupeImg: entity.groupe_code.includes('NI') ? null : `/tribun/${legislature}/logos_groupes/${entity.groupe_code}.png`,
        groupePresidentFullName: entity.groupe_president_full_name,
        groupeQualitySexLabel: entity.groupe_label_type_sex,
        groupeSeatsSharePercent: entity.groupe_seats_share_percent,
        //todo color
    };
}
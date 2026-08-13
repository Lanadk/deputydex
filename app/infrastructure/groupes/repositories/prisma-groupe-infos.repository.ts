import {IGroupeInfosRepository} from "@/app/domains/groupes/repositories/IGroupeInfosRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {GroupeInfosEntity} from "@/app/domains/groupes/entities/groupe-infos.entity";

export const prismaGroupeInfosRepository: IGroupeInfosRepository = {

    async getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosEntity[]> {
        try {
            // groupe_year_of_creation / groupe_web_site viennent en priorité du
            // référentiel ref_groupes_fondation (saisi/maintenu à la main, par
            // identité de parti via groupe_code), avec repli sur les colonnes de
            // la vue agrégée si le référentiel n'a pas (encore) de ligne pour ce code.
            return await prisma.$queryRaw<GroupeInfosEntity[]>`
                SELECT
                    v.legislature,
                    v.groupe_id,
                    v.groupe_label,
                    v.groupe_code,
                    v.groupe_position,
                    v.groupe_count_members,
                    v.groupe_rank,
                    COALESCE(rgf.annee_fondation::text, v.groupe_year_of_creation) AS groupe_year_of_creation,
                    COALESCE(rgf.site_officiel, v.groupe_web_site) AS groupe_web_site,
                    v.groupe_president_full_name,
                    v.groupe_quality_sex_label,
                    v.groupe_seats_share_percent
                FROM agg_groupes_fiche_infos v
                LEFT JOIN ref_groupes_fondation rgf ON rgf.groupe_code = v.groupe_code
                WHERE v.legislature = ${legislature}
                  AND v.groupe_code = ${code}
            `;

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}
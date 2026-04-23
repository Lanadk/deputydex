import {IGroupesCardsRepository} from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {GroupeCardEntity} from "@/app/domains/groupes/entities/groupe-card.entity";

export const prismaGroupesCardsRepository: IGroupesCardsRepository = {

    async getGroupesCards(legislature: number): Promise<GroupeCardEntity[]> {
        //TODO surement faire un check de ce qu'on veut recupere , car on fetch les groupes ayant existé mais le fetch remonté des nb_acteurs à 0
        try {
            return await prisma.$queryRaw<GroupeCardEntity[]>`
                select
                    rg.groupe_id as groupe_id,
                    rg.code as groupe_code,
                    rg.libelle as groupe_label,
                    trim(concat(coalesce(mgp.prenom, ''), ' ', coalesce(mgp.nom, ''))) as groupe_president_full_name,
                    mgp.lib_qualite_sex as groupe_label_type_sex,
                    coalesce(agec.nb_acteurs_photo, 0) as groupe_count_members
                from ref_groupes rg
                left join mv_groupes_presidents mgp
                    on mgp.groupe_id = rg.groupe_id
                   and mgp.legislature = rg.groupe_legislature
                left join agg_groupes_effectifs_legislature agec
                    on agec.groupe_id = rg.groupe_id
                   and agec.legislature = rg.groupe_legislature
                where rg.groupe_legislature = ${legislature}
                and rg.code not in ('TBD', 'NI')
                order by rg.code asc nulls last, rg.libelle asc nulls last
            `;
        } catch (error) {
            console.error("Error fetching group cards:", error);
            throw new Error("Failed to fetch group cards");
        }
    }
}
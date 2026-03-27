import {IGroupesCardsRepository} from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";

type GroupeCardRow = {
    groupe_id: string;
    groupe_code: string | null;
    groupe_label: string | null;
    groupe_president_full_name: string | null;
    groupe_label_type_sex: string | null;
    groupe_count_members: number | null;
};

export const prismaGroupesCardsRepository: IGroupesCardsRepository = {

    async getGroupeCardsUseCase(legislature: number): Promise<any[]> {
        try {
            return await prisma.$queryRaw<GroupeCardRow[]>`
                select
                    rg.groupe_id as groupe_id,
                    rg.code as groupe_code,
                    rg.libelle as groupe_label,
                    trim(concat(coalesce(mgp.prenom, ''), ' ', coalesce(mgp.nom, ''))) as groupe_president_full_name,
                    mgp.lib_qualite_sex as groupe_label_type_sex,
                    coalesce(agec.nb_acteurs, 0) as groupe_count_members
                from ref_groupes rg
                left join mv_groupes_presidents mgp
                    on mgp.groupe_id = rg.groupe_id
                   and mgp.legislature = rg.groupe_legislature
                left join agg_groupes_effectifs_current agec
                    on agec.groupe_id = rg.groupe_id
                   and agec.legislature = rg.groupe_legislature
                where rg.groupe_legislature = ${legislature}
                and agec.nb_acteurs > 0
                and rg.code != 'TBD'
                order by rg.code asc nulls last, rg.libelle asc nulls last
            `;
        } catch (error) {
            console.error("Error fetching group cards:", error);
            throw new Error("Failed to fetch group cards");
        }
    }
}
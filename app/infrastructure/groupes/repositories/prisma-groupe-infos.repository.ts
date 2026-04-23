import {IGroupeInfosRepository} from "@/app/domains/groupes/repositories/IGroupeInfosRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {GroupeInfosEntity} from "@/app/domains/groupes/entities/groupe-infos.entity";


export const prismaGroupeInfosRepository: IGroupeInfosRepository = {

    async getGroupeInfos(code: string, legislature: number): Promise<GroupeInfosEntity[]> {
        try {
            return await prisma.$queryRaw<GroupeInfosEntity[]>`
                SELECT *
                FROM agg_groupes_fiche_infos
                WHERE legislature = ${legislature}
                  AND groupe_code = ${code}
            `;

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}
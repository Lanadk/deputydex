import {IGroupeLegislaturesRepository} from "@/app/domains/groupes/repositories/IGroupeLegislaturesRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {GroupeLegislatureEntity} from "@/app/domains/groupes/entities/groupe-legislatures.entity";

export const prismaGroupeLegislaturesRepository: IGroupeLegislaturesRepository = {

    async getGroupeLegislatures(code: string): Promise<GroupeLegislatureEntity[]> {
        try {
            return await prisma.$queryRaw<GroupeLegislatureEntity[]>`
                SELECT DISTINCT groupe_legislature AS legislature
                FROM ref_groupes
                WHERE code = ${code}
                ORDER BY legislature
            `;
        } catch (error) {
            console.error("Error fetching group legislatures:", error);
            throw new Error("Failed to fetch group legislatures");
        }
    }
}

import {GroupeActivityDetailsEntity} from "@/app/domains/groupes/entities/groupe-activity-details.entity";
import {IGroupeActivityDetailsRepository} from "@/app/domains/groupes/repositories/IGroupeActivityDetailsRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";

export const prismaGroupeActivityDetailsRepository: IGroupeActivityDetailsRepository = {
    async getGroupeActivityDetails(
        code: string,
        legislature: number,
        date: string
    ): Promise<GroupeActivityDetailsEntity[]> {
        try {
            return await prisma.$queryRaw<GroupeActivityDetailsEntity[]>`
                SELECT
                    acd.activity_date,
                    acd.domain,
                    acd.ref_id,
                    acd.meta
                FROM activity_calendar_details_mv acd
                JOIN ref_groupes rg
                    ON rg.groupe_id = acd.entity_id
                    AND rg.groupe_legislature = acd.legislature
                WHERE rg.code = ${code}
                  AND acd.entity_type = 'groupe'
                  AND acd.legislature = ${legislature}
                  AND acd.activity_date = ${new Date(date)}
                ORDER BY acd.activity_date ASC
            `;
        } catch (error) {
            console.error("Error fetching activity details:", error);
            throw new Error("Failed to fetch activity details");
        }
    }
};
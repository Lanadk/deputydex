import {IGroupeActivityRepository} from "@/app/domains/groupes/repositories/IGroupeActivityRepository";
import {GroupeActivityEntity} from "@/app/domains/groupes/entities/groupe-activity.entity";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";

export const prismaGroupeActivityRepository: IGroupeActivityRepository = {
    async getGroupeActivity(code: string, legislature: number): Promise<GroupeActivityEntity[]> {
        try {
            return await prisma.$queryRaw<GroupeActivityEntity[]>`
                SELECT
                    mv.activity_date,
                    SUM(mv.count) as total_count
                FROM activity_calendar_mv mv
                         JOIN ref_groupes rg
                              ON rg.groupe_id = mv.entity_id
                                  AND rg.groupe_legislature = mv.legislature
                WHERE mv.entity_type = 'groupe'
                  AND rg.code = ${code}
                  AND mv.legislature = ${legislature}
                GROUP BY mv.activity_date
                ORDER BY mv.activity_date ASC
            `;
        } catch (error) {
            console.error("Error fetching activity:", error);
            throw new Error("Failed to fetch activity");
        }
    }
};
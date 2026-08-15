"server-only";

import { IDeputeActivityRepository } from "@/app/domains/deputes/repositories/IDeputeActivityRepository";
import { DeputeActivityEntity } from "@/app/domains/deputes/entities/depute-activity.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeActivityRepository: IDeputeActivityRepository = {
    async getDeputeActivity(uid: string, legislature: number): Promise<DeputeActivityEntity[]> {
        try {
            return await prisma.$queryRaw<DeputeActivityEntity[]>`
                SELECT
                    activity_date,
                    COUNT(*) as total_count
                FROM agg_activity_calendar_details_mv
                WHERE entity_type = 'depute'
                  AND entity_id = ${uid}
                  AND legislature = ${legislature}
                  AND NOT (domain = 'vote' AND meta ->> 'position' = 'non_votant')
                GROUP BY activity_date
                ORDER BY activity_date ASC
            `;
        } catch (error) {
            console.error("Error fetching depute activity:", error);
            throw new Error("Failed to fetch depute activity");
        }
    },
};

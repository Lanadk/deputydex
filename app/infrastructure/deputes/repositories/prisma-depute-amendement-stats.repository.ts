"server-only";

import { IDeputeAmendementStatsRepository } from "@/app/domains/deputes/repositories/IDeputeAmendementStatsRepository";
import { DeputeAmendementStatsEntity } from "@/app/domains/deputes/entities/depute-amendement-stats.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeAmendementStatsRepository: IDeputeAmendementStatsRepository = {
    async getDeputeAmendementStats(uid: string, legislature: number): Promise<DeputeAmendementStatsEntity | null> {
        const rows = await prisma.$queryRaw<DeputeAmendementStatsEntity[]>`
            SELECT
                COUNT(*)                                           AS total_depose,
                COUNT(*) FILTER (WHERE sort = 'Adopté')           AS total_adopte
            FROM amendements
            WHERE acteur_uid = ${uid}
              AND legislature_snapshot = ${legislature}
        `;
        return rows[0] ?? null;
    },
};

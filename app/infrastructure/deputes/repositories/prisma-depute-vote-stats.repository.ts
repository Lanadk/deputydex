"server-only";

import { IDeputeVoteStatsRepository } from "@/app/domains/deputes/repositories/IDeputeVoteStatsRepository";
import { DeputeVoteStatsEntity } from "@/app/domains/deputes/entities/depute-vote-stats.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeVoteStatsRepository: IDeputeVoteStatsRepository = {
    async getDeputeVoteStats(uid: string, legislature: number): Promise<DeputeVoteStatsEntity | null> {
        const rows = await prisma.$queryRaw<DeputeVoteStatsEntity[]>`
            SELECT * FROM agg_deputes_stats_votes WHERE depute_uid = ${uid} AND legislature = ${legislature}
        `;
        return rows[0] ?? null;
    },
};

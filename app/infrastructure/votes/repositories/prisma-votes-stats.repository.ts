import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IVotesStatsRepository } from "@/app/domains/votes/repositories/IVotesStatsRepository";
import { VotePositionsTotalsEntity } from "@/app/domains/votes/entities/vote-positions-totals.entity";

export const prismaVotesStatsRepository: IVotesStatsRepository = {
    async getPositionsTotals(): Promise<VotePositionsTotalsEntity> {
        const rows = await prisma.$queryRaw<VotePositionsTotalsEntity[]>`
            SELECT
                COALESCE(SUM(total_pour), 0)::int AS total_pour,
                COALESCE(SUM(total_contre), 0)::int AS total_contre,
                COALESCE(SUM(total_abstentions), 0)::int AS total_abstentions,
                COALESCE(SUM(total_non_votants), 0)::int AS total_non_votants
            FROM scrutins_agregats
        `;
        return rows[0] ?? { total_pour: 0, total_contre: 0, total_abstentions: 0, total_non_votants: 0 };
    },
};

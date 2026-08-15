import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { ILegislaturesStatsRepository } from "@/app/domains/legislatures/repositories/ILegislaturesStatsRepository";
import { LegislaturePariteRow } from "@/app/domains/legislatures/entities/legislature-parite-evolution.entity";

export const prismaLegislaturesStatsRepository: ILegislaturesStatsRepository = {
    async getPariteEvolution(): Promise<LegislaturePariteRow[]> {
        return prisma.$queryRaw<LegislaturePariteRow[]>`
            SELECT legislature,
                   SUM(nb_hommes)::int AS nb_hommes,
                   SUM(nb_femmes)::int AS nb_femmes
            FROM agg_groupes_stats_parite
            GROUP BY legislature
            ORDER BY legislature ASC
        `;
    },
};

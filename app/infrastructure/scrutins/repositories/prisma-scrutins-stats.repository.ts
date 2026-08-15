import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";
import { ScrutinParticipationPointEntity } from "@/app/domains/scrutins/entities/scrutin-participation-evolution.entity";

export const prismaScrutinsStatsRepository: IScrutinsStatsRepository = {
    async getParticipationEvolution(): Promise<ScrutinParticipationPointEntity[]> {
        return prisma.$queryRaw<ScrutinParticipationPointEntity[]>`
            SELECT
                to_char(date_trunc('month', s.date_scrutin), 'YYYY-MM') AS mois,
                AVG(
                    CASE
                        WHEN (sa.nombre_votants + sa.total_non_votants) > 0
                            THEN sa.nombre_votants::float / (sa.nombre_votants + sa.total_non_votants) * 100
                        ELSE NULL
                    END
                )::float AS taux_participation
            FROM scrutins s
            JOIN scrutins_agregats sa ON sa.scrutin_uid = s.uid
            WHERE s.date_scrutin IS NOT NULL
            GROUP BY mois
            ORDER BY mois ASC
        `;
    },
};

"server-only";

import { IDeputeVoteStatsRepository } from "@/app/domains/deputes/repositories/IDeputeVoteStatsRepository";
import { DeputeVoteStatsEntity } from "@/app/domains/deputes/entities/depute-vote-stats.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeVoteStatsRepository: IDeputeVoteStatsRepository = {
    async getDeputeVoteStats(uid: string, legislature: number): Promise<DeputeVoteStatsEntity | null> {
        const rows = await prisma.$queryRaw<DeputeVoteStatsEntity[]>`
            SELECT
                COUNT(*)                                                                              AS total_votes,
                COUNT(*) FILTER (WHERE vd.position = 'pour')                                         AS total_pour,
                COUNT(*) FILTER (WHERE vd.position = 'contre')                                       AS total_contre,
                COUNT(*) FILTER (WHERE vd.position = 'abstention')                                   AS total_abstentions,
                COUNT(*) FILTER (WHERE vd.position = 'nonVotant')                                    AS total_non_votants,
                COUNT(*) FILTER (WHERE sg.position_majoritaire IS NOT NULL
                                    AND vd.position != sg.position_majoritaire
                                    AND vd.position != 'nonVotant')                                  AS total_rebel,
                ROUND(
                    COUNT(*) FILTER (WHERE sg.position_majoritaire IS NOT NULL
                                       AND vd.position = sg.position_majoritaire)
                    * 100.0 / NULLIF(
                        COUNT(*) FILTER (WHERE sg.position_majoritaire IS NOT NULL
                                           AND vd.position != 'nonVotant'), 0
                    ), 1
                )                                                                                     AS taux_fidelite,
                ROUND(
                    COUNT(*) FILTER (WHERE vd.position != 'nonVotant')
                    * 100.0 / NULLIF(COUNT(*), 0), 1
                )                                                                                     AS taux_participation
            FROM votes_deputes vd
            JOIN scrutins s
                ON s.uid = vd.scrutin_uid
               AND s.legislature_snapshot = ${legislature}
            LEFT JOIN scrutins_groupes sg
                ON sg.scrutin_uid = vd.scrutin_uid
               AND sg.groupe_id = vd.groupe_id
            WHERE vd.depute_id = ${uid}
        `;
        return rows[0] ?? null;
    },
};

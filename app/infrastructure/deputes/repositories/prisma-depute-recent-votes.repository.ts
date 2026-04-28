"server-only";

import { IDeputeRecentVotesRepository } from "@/app/domains/deputes/repositories/IDeputeRecentVotesRepository";
import { DeputeRecentVoteEntity } from "@/app/domains/deputes/entities/depute-recent-vote.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeRecentVotesRepository: IDeputeRecentVotesRepository = {
    async getDeputeRecentVotes(uid: string, legislature: number, limit: number): Promise<DeputeRecentVoteEntity[]> {
        return prisma.$queryRaw<DeputeRecentVoteEntity[]>`
            SELECT
                s.uid               AS scrutin_uid,
                s.titre,
                s.date_scrutin,
                vd.position,
                sg.position_majoritaire AS groupe_position
            FROM votes_deputes vd
            JOIN scrutins s
                ON s.uid = vd.scrutin_uid
               AND s.legislature_snapshot = ${legislature}
            LEFT JOIN scrutins_groupes sg
                ON sg.scrutin_uid = vd.scrutin_uid
               AND sg.groupe_id = vd.groupe_id
            WHERE vd.depute_id = ${uid}
            ORDER BY s.date_scrutin DESC NULLS LAST
            LIMIT ${limit}
        `;
    },
};

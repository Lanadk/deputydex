import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {IGroupeCohesionRepository} from "@/app/domains/groupes/repositories/IGroupeCohesionRepository";

export type GroupeCohesionRow = {
    mois: Date;
    taux_cohesion: number | null;
}

export const prismaGroupeCohesionRepository: IGroupeCohesionRepository = {

    async getGroupeCohesion(code: string, legislature: number): Promise<GroupeCohesionRow[]> {
        try {
            return await prisma.$queryRaw<GroupeCohesionRow[]>`
                SELECT mois, taux_cohesion
                FROM agg_groupes_stats_cohesion_mensuelle
                WHERE code = ${code}
                  AND legislature = ${legislature}
                ORDER BY mois ASC
            `;

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}
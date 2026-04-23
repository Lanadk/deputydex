import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {IGroupeCohesionRepository} from "@/app/domains/groupes/repositories/IGroupeCohesionRepository";
import {GroupeCohesionEntity} from "@/app/domains/groupes/entities/groupe-cohesion.entity";

export type EvolutionCohesionLegislatureRow = {
    mois: Date;
    taux_cohesion: number | null;
}

export const prismaGroupeCohesionRepository: IGroupeCohesionRepository = {

    async getGroupeCohesionLegislature(code: string, legislature: number): Promise<GroupeCohesionEntity> {
        try {
            const evolutionCohesionLegislature = await prisma.$queryRaw<EvolutionCohesionLegislatureRow[]>`
                SELECT mois, taux_cohesion
                FROM agg_groupes_stats_cohesion_mensuelle
                WHERE code = ${code}
                  AND legislature = ${legislature}
                ORDER BY mois ASC
            `;
            return { evolutionCohesionLegislature };

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}
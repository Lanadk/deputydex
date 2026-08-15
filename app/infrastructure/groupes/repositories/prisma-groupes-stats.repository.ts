import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import {
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatPariteEntity,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

export const prismaGroupesStatsRepository: IGroupesStatsRepository = {
    async getParite(code: string, legislature: number): Promise<GroupeStatPariteEntity> {
        const rows = await prisma.$queryRaw<{ nb_hommes: number; nb_femmes: number }[]>`
            SELECT nb_hommes::int, nb_femmes::int
            FROM agg_groupes_stats_parite
            WHERE groupe_code = ${code}
              AND legislature = ${legislature}
            LIMIT 1
        `;
        return rows[0] ?? null;
    },

    async getPariteMoyenne(legislature: number): Promise<GroupeStatPariteEntity> {
        const rows = await prisma.$queryRaw<{ nb_hommes: number; nb_femmes: number }[]>`
            SELECT COALESCE(SUM(nb_hommes), 0)::int AS nb_hommes,
                   COALESCE(SUM(nb_femmes), 0)::int AS nb_femmes
            FROM agg_groupes_stats_parite
            WHERE legislature = ${legislature}
        `;
        return rows[0] ?? null;
    },

    async getEffectifs(legislature: number): Promise<GroupeStatEffectifRow[]> {
        return prisma.$queryRaw<GroupeStatEffectifRow[]>`
            SELECT rg.code AS groupe_code,
                   rg.libelle AS groupe_label,
                   COALESCE(agec.nb_acteurs_photo, 0)::int AS nb_acteurs
            FROM ref_groupes rg
            LEFT JOIN agg_groupes_effectifs_legislature agec
                ON agec.groupe_id = rg.groupe_id
               AND agec.legislature = rg.groupe_legislature
            WHERE rg.groupe_legislature = ${legislature}
              AND rg.code NOT IN ('TBD', 'NI')
            ORDER BY nb_acteurs DESC
        `;
    },

    async getCohesionEvolution(code: string, legislature: number): Promise<GroupeStatCohesionPointEntity[]> {
        return prisma.$queryRaw<GroupeStatCohesionPointEntity[]>`
            SELECT mois, taux_cohesion
            FROM agg_groupes_stats_cohesion_mensuelle
            WHERE code = ${code}
              AND legislature = ${legislature}
            ORDER BY mois ASC
        `;
    },
};

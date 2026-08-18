import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IDeputesAgeRepository } from "@/app/domains/deputes/repositories/IDeputesAgeRepository";
import { DeputeAgeRow } from "@/app/domains/deputes/entities/depute-age.entity";

export const prismaDeputesAgeRepository: IDeputesAgeRepository = {
    async getAgeExtremes(legislature: number): Promise<DeputeAgeRow[]> {
        // Deux requêtes bornées à 1 ligne (le/la plus jeune, le/la plus âgé·e)
        // plutôt qu'un ORDER BY sur l'ensemble des ~577 députés : on n'a besoin
        // que des deux extrêmes, pas d'un classement complet (contrairement à
        // getAgeParGroupe côté groupes, où toutes les lignes servent au
        // classement affiché).
        return prisma.$queryRaw<DeputeAgeRow[]>`
            (SELECT depute_uid, age FROM agg_deputes_stats_age WHERE legislature = ${legislature} ORDER BY age ASC LIMIT 1)
            UNION ALL
            (SELECT depute_uid, age FROM agg_deputes_stats_age WHERE legislature = ${legislature} ORDER BY age DESC LIMIT 1)
        `;
    },
};

import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { AgeDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-age-distribution.entity";

export const prismaActeursStatsRepository: IActeursStatsRepository = {
    async getAgeDistribution(): Promise<AgeDistributionBucketEntity[]> {
        // GROUP BY sur l'alias "tranche_age" nu est autorisé par Postgres, mais
        // l'utiliser DANS une expression en ORDER BY (le CASE ci-dessous) ne
        // l'est pas : Postgres tente alors de le résoudre comme une vraie
        // colonne de "acteurs", qui n'existe pas (erreur 42703). On passe donc
        // par une sous-requête : "tranche_age" y redevient une colonne réelle,
        // librement référençable dans le ORDER BY externe.
        return prisma.$queryRaw<AgeDistributionBucketEntity[]>`
            SELECT tranche_age, nb_acteurs
            FROM (
                SELECT
                    CASE
                        WHEN EXTRACT(YEAR FROM AGE(date_naissance)) < 30 THEN '<30'
                        WHEN EXTRACT(YEAR FROM AGE(date_naissance)) BETWEEN 30 AND 39 THEN '30-39'
                        WHEN EXTRACT(YEAR FROM AGE(date_naissance)) BETWEEN 40 AND 49 THEN '40-49'
                        WHEN EXTRACT(YEAR FROM AGE(date_naissance)) BETWEEN 50 AND 59 THEN '50-59'
                        WHEN EXTRACT(YEAR FROM AGE(date_naissance)) BETWEEN 60 AND 69 THEN '60-69'
                        ELSE '70+'
                    END AS tranche_age,
                    COUNT(*)::int AS nb_acteurs
                FROM acteurs
                WHERE date_naissance IS NOT NULL
                GROUP BY tranche_age
            ) buckets
            ORDER BY
                CASE tranche_age
                    WHEN '<30' THEN 1
                    WHEN '30-39' THEN 2
                    WHEN '40-49' THEN 3
                    WHEN '50-59' THEN 4
                    WHEN '60-69' THEN 5
                    ELSE 6
                END
        `;
    },
};

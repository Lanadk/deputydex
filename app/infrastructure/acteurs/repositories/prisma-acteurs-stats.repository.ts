import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { AgeDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-age-distribution.entity";
import { GenderDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-gender-distribution.entity";
import { ProfessionDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-profession-distribution.entity";
import { ProfessionFamilleDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-profession-famille-distribution.entity";
import { ActeurEntity } from "@/app/domains/acteurs/entities/acteurs.entity";

export const prismaActeursStatsRepository: IActeursStatsRepository = {
    async searchDeputies(search?: string): Promise<ActeurEntity[]> {
        // Un député reste "le même député" quelle que soit la législature —
        // pas de filtre législature ici, juste "a réellement eu un mandat un
        // jour" (EXISTS mandats), pour ne lister que de vrais députés parmi
        // les acteurs (qui inclut aussi ministres, personnalités politiques...).
        if (search && search.trim().length > 0) {
            return prisma.$queryRaw<ActeurEntity[]>`
                SELECT uid, prenom, nom, profession_categorie, date_naissance
                FROM acteurs a
                WHERE EXISTS (SELECT 1 FROM mandats m WHERE m.acteur_uid = a.uid)
                  AND (nom ILIKE ${`%${search.trim()}%`} OR prenom ILIKE ${`%${search.trim()}%`})
                ORDER BY nom ASC NULLS LAST, prenom ASC NULLS LAST
                LIMIT 50
            `;
        }

        return prisma.$queryRaw<ActeurEntity[]>`
            SELECT uid, prenom, nom, profession_categorie, date_naissance
            FROM acteurs a
            WHERE EXISTS (SELECT 1 FROM mandats m WHERE m.acteur_uid = a.uid)
            ORDER BY nom ASC NULLS LAST, prenom ASC NULLS LAST
            LIMIT 50
        `;
    },

    async getAgeDistribution(legislature?: number): Promise<AgeDistributionBucketEntity[]> {
        // GROUP BY sur l'alias "tranche_age" nu est autorisé par Postgres, mais
        // l'utiliser DANS une expression en ORDER BY (le CASE ci-dessous) ne
        // l'est pas : Postgres tente alors de le résoudre comme une vraie
        // colonne de "acteurs", qui n'existe pas (erreur 42703). On passe donc
        // par une sous-requête : "tranche_age" y redevient une colonne réelle,
        // librement référençable dans le ORDER BY externe.
        if (legislature != null) {
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
                    FROM acteurs a
                    WHERE a.date_naissance IS NOT NULL
                      AND EXISTS (SELECT 1 FROM mandats m WHERE m.acteur_uid = a.uid AND m.legislature = ${legislature})
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
        }

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

    async getGenderDistribution(legislature?: number): Promise<GenderDistributionBucketEntity[]> {
        if (legislature != null) {
            // Source alignée sur `legislatures.parite` (agg_groupes_stats_parite,
            // sommée par législature) — PAS un COUNT sur `mandats` filtré par
            // EXISTS : ce dernier compte tous les député·es ayant eu un mandat
            // à un moment de la législature, remplacements en cours de route
            // inclus, un total structurellement plus élevé que l'effectif réel
            // à un instant donné. Les deux chiffres divergeaient (et pouvaient
            // même s'inverser d'une législature à l'autre, le volume de
            // remplacements variant), ce qui produisait des % différents entre
            // la répartition affichée ici et l'évolution par législature —
            // les deux doivent parler de la même population : la composition
            // "photo" du groupe, pas le cumul de tous ses occupants successifs.
            const rows = await prisma.$queryRaw<{ nb_hommes: number; nb_femmes: number }[]>`
                SELECT COALESCE(SUM(nb_hommes), 0)::int AS nb_hommes,
                       COALESCE(SUM(nb_femmes), 0)::int AS nb_femmes
                FROM agg_groupes_stats_parite
                WHERE legislature = ${legislature}
            `;
            const { nb_hommes, nb_femmes } = rows[0] ?? { nb_hommes: 0, nb_femmes: 0 };
            return [
                { civilite: "M.", nb_acteurs: nb_hommes },
                { civilite: "Mme", nb_acteurs: nb_femmes },
            ];
        }

        return prisma.$queryRaw<GenderDistributionBucketEntity[]>`
            SELECT civilite, COUNT(*)::int AS nb_acteurs
            FROM acteurs
            WHERE civilite IS NOT NULL
            GROUP BY civilite
        `;
    },

    async getMandatsCount(acteurUid: string): Promise<number> {
        const rows = await prisma.$queryRaw<{ nb_mandats: number }[]>`
            SELECT COUNT(*)::int AS nb_mandats
            FROM mandats
            WHERE acteur_uid = ${acteurUid}
        `;
        return rows[0]?.nb_mandats ?? 0;
    },

    async getProfessionDistribution(legislature: number): Promise<ProfessionDistributionBucketEntity[]> {
        // `agg_acteurs_stats_professions` a une ligne par (categorie, famille)
        // — on regroupe par categorie pour la vue d'ensemble ("De quels
        // horizons professionnels viennent les député·es ?"), la famille
        // (plus fine) n'est pas utilisée par ce thème.
        return prisma.$queryRaw<ProfessionDistributionBucketEntity[]>`
            SELECT profession_categorie, SUM(nb_acteurs)::int AS nb_acteurs
            FROM agg_acteurs_stats_professions
            WHERE legislature = ${legislature}
              AND type_organe = 'ASSEMBLEE'
            GROUP BY profession_categorie
            ORDER BY nb_acteurs DESC
        `;
    },

    async getProfessionFamilleDistribution(legislature: number): Promise<ProfessionFamilleDistributionBucketEntity[]> {
        // `agg_acteurs_stats_professions` porte deux variantes d'orthographe
        // pour la même famille ("Artisans, commerçants, chefs d'entreprises"
        // vs "...et chefs d'entreprise") — contrairement à la vue équivalente
        // côté groupes (agg_groupes_stats_professions_familles), celle-ci
        // n'est pas normalisée. Même normalisation ici, même libellé canonique.
        return prisma.$queryRaw<ProfessionFamilleDistributionBucketEntity[]>`
            SELECT profession_famille, SUM(nb_acteurs)::int AS nb_acteurs
            FROM (
                SELECT
                    CASE
                        WHEN profession_famille IN (
                            'Artisans, commerçants, chefs d''entreprises',
                            'Artisans, commerçants et chefs d''entreprise'
                        ) THEN 'Artisans, commerçants et chefs d''entreprise'
                        ELSE profession_famille
                    END AS profession_famille,
                    nb_acteurs
                FROM agg_acteurs_stats_professions
                WHERE legislature = ${legislature}
                  AND type_organe = 'ASSEMBLEE'
            ) normalized
            GROUP BY profession_famille
            ORDER BY nb_acteurs DESC
        `;
    },
};

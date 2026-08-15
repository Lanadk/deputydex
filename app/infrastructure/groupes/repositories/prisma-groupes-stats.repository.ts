import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import {
    GroupeFeminisationMouvementRow,
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatPariteEntity,
    GroupeStatPariteParGroupeRow,
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

    async getPariteParGroupe(legislature: number): Promise<GroupeStatPariteParGroupeRow[]> {
        // "Non inscrits" (code commençant par NI) exclu : ce n'est pas un
        // groupe politique, juste l'absence de rattachement — un taux de
        // féminisation n'a pas de sens à comparer pour cette catégorie.
        return prisma.$queryRaw<GroupeStatPariteParGroupeRow[]>`
            SELECT rg.code AS groupe_code,
                   rg.libelle AS groupe_label,
                   agp.nb_hommes::int,
                   agp.nb_femmes::int,
                   agp.nb_total::int
            FROM agg_groupes_stats_parite agp
            JOIN ref_groupes rg
                ON rg.groupe_id = agp.groupe_id
               AND rg.groupe_legislature = agp.legislature
            WHERE agp.legislature = ${legislature}
              AND rg.code NOT LIKE 'NI%'
            ORDER BY (agp.nb_femmes::float / NULLIF(agp.nb_total, 0)) DESC NULLS LAST
        `;
    },

    async getFeminisationMouvements(legislature: number): Promise<GroupeFeminisationMouvementRow[]> {
        // "Intégrée" = une femme dont l'arrivée dans CE groupe (date_debut)
        // n'est pas la date de constitution du groupe lui-même (son propre
        // date_debut minimum sur la législature) — donc un vrai mouvement
        // pendant la législature, pas la composition du premier jour.
        // "Partie" = une femme dont la ligne d'appartenance à CE groupe a une
        // date_fin (quelle qu'en soit la raison : changement de groupe, fin
        // de mandat, remplacement...).
        // Portée restreinte aux groupes présents dans agg_groupes_stats_parite
        // (= groupes politiques réellement actifs cette législature) : exclut
        // à la fois "Non inscrits" et les organes techniques/historiques
        // (ex: un ancien code de groupe renommé en cours de législature, qui
        // n'a plus aucun membre actuellement) qui polluent sinon le classement
        // avec du bruit sans rapport avec un vrai gain/perte de membres.
        return prisma.$queryRaw<GroupeFeminisationMouvementRow[]>`
            WITH groupes_actuels AS (
                SELECT groupe_id FROM agg_groupes_stats_parite WHERE legislature = ${legislature}
            ),
            groupe_min_debut AS (
                SELECT groupe_id, MIN(date_debut) AS min_debut
                FROM acteurs_groupes
                WHERE groupe_legislature = ${legislature}
                GROUP BY groupe_id
            )
            SELECT
                rg.code AS groupe_code,
                rg.libelle AS groupe_label,
                COUNT(DISTINCT CASE WHEN a.civilite = 'Mme' AND ag.date_debut > gmd.min_debut THEN ag.acteur_uid END)::int AS femmes_arrivees,
                COUNT(DISTINCT CASE WHEN a.civilite = 'Mme' AND ag.date_fin IS NOT NULL THEN ag.acteur_uid END)::int AS femmes_parties
            FROM acteurs_groupes ag
            JOIN acteurs a ON a.uid = ag.acteur_uid
            JOIN groupe_min_debut gmd ON gmd.groupe_id = ag.groupe_id
            JOIN ref_groupes rg
                ON rg.groupe_id = ag.groupe_id
               AND rg.groupe_legislature = ag.groupe_legislature
            WHERE ag.groupe_legislature = ${legislature}
              AND ag.groupe_id IN (SELECT groupe_id FROM groupes_actuels)
              AND rg.code NOT LIKE 'NI%'
            GROUP BY rg.code, rg.libelle
        `;
    },
};

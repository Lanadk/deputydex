import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";
import {
    GroupeFeminisationMouvementRow,
    GroupeListItemRow,
    GroupeStatAgeParGroupeRow,
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatExpressionVoteRow,
    GroupeStatParticipationEvolutionPointEntity,
    GroupeStatParticipationEvolutionTousRow,
    GroupeStatParticipationRow,
    GroupeStatPariteEntity,
    GroupeStatPariteParGroupeRow,
    GroupeStatPositionVoteRow,
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
              AND rg.code <> 'TBD'
              AND rg.code NOT LIKE 'NI%'
            ORDER BY nb_acteurs DESC
        `;
    },

    async getCohesionEvolution(code: string, legislature: number): Promise<GroupeStatCohesionPointEntity[]> {
        // taux_cohesion est un NUMERIC Postgres — sans cast explicite, prisma.$queryRaw
        // le renvoie en string malgré le typage TS de $queryRaw<T>() (assertion de
        // compilation, pas de validation runtime). Même bug que celui qui cassait
        // silencieusement le domaine numérique de MUI X-Charts en mode dataset
        // multi-series sur getParticipationEvolutionParGroupe/TousGroupes.
        return prisma.$queryRaw<GroupeStatCohesionPointEntity[]>`
            SELECT mois, taux_cohesion::float AS taux_cohesion
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

    async getAgeParGroupe(legislature: number): Promise<GroupeStatAgeParGroupeRow[]> {
        // "Non inscrits" exclu : même méthodologie que getPariteParGroupe —
        // ce n'est pas un groupe politique, un âge moyen n'a pas de sens à
        // comparer pour cette catégorie.
        return prisma.$queryRaw<GroupeStatAgeParGroupeRow[]>`
            SELECT rg.code AS groupe_code,
                   rg.libelle AS groupe_label,
                   aga.average_age::float AS average_age
            FROM agg_groupes_stats_age aga
            JOIN ref_groupes rg
                ON rg.groupe_id = aga.groupe_id
               AND rg.groupe_legislature = aga.legislature
            WHERE aga.legislature = ${legislature}
              AND rg.code NOT LIKE 'NI%'
            ORDER BY aga.average_age ASC
        `;
    },

    async getPositionsVoteParGroupe(legislature: number): Promise<GroupeStatPositionVoteRow[]> {
        // JOIN sur agg_groupes_effectifs_legislature (nb_acteurs_photo > 0) :
        // la vue source garde des lignes pour un groupe renommé/dissous en
        // cours de législature (ex: UDR → UDDPR) tant qu'il a des votes
        // historiques, même si son effectif actuel est retombé à 0 — voir
        // IGroupesStatsRepository.getPositionsVoteParGroupe.
        // "Non inscrits" exclu via `NOT LIKE 'NI%'` (pas `NOT IN (..., 'NI')`) :
        // le code peut être suffixé par législature (ex: "NI-17"), même
        // méthodologie que getPariteParGroupe/getAgeParGroupe.
        return prisma.$queryRaw<GroupeStatPositionVoteRow[]>`
            SELECT vpp.code AS groupe_code,
                   vpp.libelle AS groupe_label,
                   vpp.position,
                   vpp.pourcentage::float AS pourcentage
            FROM agg_groupes_stats_votes_positions_politiques vpp
            JOIN agg_groupes_effectifs_legislature agel
                ON agel.groupe_id = vpp.groupe_id
               AND agel.legislature = vpp.legislature
            WHERE vpp.legislature = ${legislature}
              AND vpp.code <> 'TBD'
              AND vpp.code NOT LIKE 'NI%'
              AND agel.nb_acteurs_photo > 0
            ORDER BY vpp.code, vpp.position
        `;
    },

    async getExpressionVotesParGroupe(legislature: number): Promise<GroupeStatExpressionVoteRow[]> {
        // Même précaution que getPositionsVoteParGroupe : la vue source garde
        // des lignes pour un groupe renommé/dissous en cours de législature
        // tant qu'il a des scrutins historiques — JOIN sur l'effectif COURANT.
        return prisma.$queryRaw<GroupeStatExpressionVoteRow[]>`
            SELECT ev.code AS groupe_code,
                   ev.libelle AS groupe_label,
                   ev.taux_expression_votes::float AS taux_expression_votes
            FROM agg_groupes_stats_expression_votes ev
            JOIN agg_groupes_effectifs_legislature agel
                ON agel.groupe_id = ev.groupe_id
               AND agel.legislature = ev.legislature
            WHERE ev.legislature = ${legislature}
              AND ev.code <> 'TBD'
              AND ev.code NOT LIKE 'NI%'
              AND agel.nb_acteurs_photo > 0
            ORDER BY ev.taux_expression_votes DESC NULLS LAST
        `;
    },

    async getParticipationParGroupe(legislature: number): Promise<GroupeStatParticipationRow[]> {
        // Même précaution que getExpressionVotesParGroupe : filtrer sur
        // l'effectif COURANT (groupe renommé/dissous en cours de législature).
        return prisma.$queryRaw<GroupeStatParticipationRow[]>`
            SELECT pl.code AS groupe_code,
                   pl.libelle AS groupe_label,
                   pl.taux_participation_legislature::float AS taux_participation
            FROM agg_groupes_stats_participation_legislature pl
            JOIN agg_groupes_effectifs_legislature agel
                ON agel.groupe_id = pl.groupe_id
               AND agel.legislature = pl.legislature
            WHERE pl.legislature = ${legislature}
              AND pl.code <> 'TBD'
              AND pl.code NOT LIKE 'NI%'
              AND agel.nb_acteurs_photo > 0
            ORDER BY pl.taux_participation_legislature DESC NULLS LAST
        `;
    },

    async getParticipationEvolutionParGroupe(code: string, legislature: number): Promise<GroupeStatParticipationEvolutionPointEntity[]> {
        // ::float impératif : `taux_participation_moyen_deputes` est un
        // NUMERIC côté Postgres, que Prisma $queryRaw renvoie en STRING sans
        // ce cast (perte de précision flottante évitée par design) — passé
        // tel quel dans un chart, ça casse silencieusement les calculs
        // numériques (pas d'erreur, juste un rendu vide/faux).
        return prisma.$queryRaw<GroupeStatParticipationEvolutionPointEntity[]>`
            SELECT mois, taux_participation_moyen_deputes::float AS taux_participation_moyen
            FROM agg_groupes_stats_participation_mensuelle
            WHERE code = ${code}
              AND legislature = ${legislature}
            ORDER BY mois ASC
        `;
    },

    async getParticipationEvolutionTousGroupes(legislature: number): Promise<GroupeStatParticipationEvolutionTousRow[]> {
        // Même périmètre que listGroupesLegislature (TBD + "NI (groupe
        // technique)" exclus, VRAIS NI et groupes à 0 membre courant
        // inclus) — voir IGroupesStatsRepository.getParticipationEvolutionTousGroupes.
        // ::float impératif — voir getParticipationEvolutionParGroupe.
        return prisma.$queryRaw<GroupeStatParticipationEvolutionTousRow[]>`
            SELECT pm.code AS groupe_code,
                   pm.libelle AS groupe_label,
                   pm.mois,
                   pm.taux_participation_moyen_deputes::float AS taux_participation_moyen
            FROM agg_groupes_stats_participation_mensuelle pm
            WHERE pm.legislature = ${legislature}
              AND pm.code <> 'TBD'
              AND pm.groupe_id <> 'PO0'
              AND pm.libelle NOT ILIKE '%technique%'
            ORDER BY pm.code ASC, pm.mois ASC
        `;
    },

    async listGroupesLegislature(legislature: number): Promise<GroupeListItemRow[]> {
        // PAS de filtre sur l'effectif courant ni sur les VRAIS Non inscrits
        // (NI-16/NI-17), volontairement — voir IGroupesStatsRepository.listGroupesLegislature.
        // Exclus : TBD (placeholder technique) et le groupe "NI (groupe
        // technique)" (ex: groupe_id 'PO0' en 17ᵉ législature, libellé "Non
        // inscrits (groupe technique)") — ce n'est pas un vrai groupe, juste
        // un rattachement administratif transitoire ; même détection que
        // agg_groupes_stats_stabilite.sql (groupe_id = 'PO0' OR libellé
        // contenant "technique").
        return prisma.$queryRaw<GroupeListItemRow[]>`
            SELECT DISTINCT code AS groupe_code, libelle AS groupe_label
            FROM ref_groupes
            WHERE groupe_legislature = ${legislature}
              AND code <> 'TBD'
              AND groupe_id <> 'PO0'
              AND libelle NOT ILIKE '%technique%'
            ORDER BY code ASC
        `;
    },
};

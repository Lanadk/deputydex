"server-only";

import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinDetailEntity } from "@/app/domains/scrutins/entities/scrutin-detail.entity";
import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";
import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";
import { ScrutinSiegeEntity } from "@/app/domains/scrutins/entities/scrutin-siege.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

// Un scrutin compte au plus ~577 votes : lecture directe des tables, sans vue
// d'agrégation. L'ordre d'affichage est une règle métier, appliquée par les use-cases.
export const prismaScrutinDetailRepository: IScrutinDetailRepository = {
    async getScrutin(uid: string): Promise<ScrutinDetailEntity | null> {
        const rows = await prisma.$queryRaw<ScrutinDetailEntity[]>`
            SELECT
                s.uid,
                s.numero,
                s.legislature_snapshot AS legislature,
                s.date_scrutin,
                s.titre,
                s.type_scrutin_code,
                s.type_scrutin_libelle,
                s.type_majorite,
                s.resultat_code,
                s.resultat_libelle,
                a.nombre_votants,
                a.suffrages_exprimes,
                a.suffrages_requis,
                a.total_pour,
                a.total_contre,
                a.total_abstentions,
                a.total_non_votants
            FROM scrutins s
            LEFT JOIN scrutins_agregats a
                ON a.scrutin_uid = s.uid
            WHERE s.uid = ${uid}
            LIMIT 1
        `;
        return rows[0] ?? null;
    },

    async getScrutinGroupes(uid: string): Promise<ScrutinGroupeVoteEntity[]> {
        return prisma.$queryRaw<ScrutinGroupeVoteEntity[]>`
            SELECT
                COALESCE(rg.code, sg.groupe_id) AS groupe_code,
                rg.libelle                      AS groupe_label,
                sg.nombre_membres,
                sg.position_majoritaire,
                ga.pour,
                ga.contre,
                ga.abstentions,
                ga.non_votants
            FROM scrutins_groupes sg
            LEFT JOIN scrutins_groupes_agregats ga
                ON ga.scrutin_uid = sg.scrutin_uid
               AND ga.groupe_id = sg.groupe_id
            LEFT JOIN ref_groupes rg
                ON rg.groupe_id = sg.groupe_id
               AND rg.groupe_legislature = sg.groupe_legislature
            WHERE sg.scrutin_uid = ${uid}
        `;
    },

    async getScrutinVotes(uid: string): Promise<ScrutinDeputeVoteEntity[]> {
        // Groupe = celui du député au moment du vote (votes_deputes.groupe_id), pas son groupe actuel.
        return prisma.$queryRaw<ScrutinDeputeVoteEntity[]>`
            SELECT
                vd.depute_id                    AS depute_uid,
                a.prenom,
                a.nom,
                COALESCE(rg.code, vd.groupe_id) AS groupe_code,
                rg.libelle                      AS groupe_label,
                vd.position,
                sg.position_majoritaire         AS groupe_position,
                vd.par_delegation
            FROM votes_deputes vd
            LEFT JOIN acteurs a
                ON a.uid = vd.depute_id
            LEFT JOIN ref_groupes rg
                ON rg.groupe_id = vd.groupe_id
               AND rg.groupe_legislature = vd.groupe_legislature
            LEFT JOIN scrutins_groupes sg
                ON sg.scrutin_uid = vd.scrutin_uid
               AND sg.groupe_id = vd.groupe_id
            WHERE vd.scrutin_uid = ${uid}
        `;
    },

    async getScrutinSieges(uid: string): Promise<ScrutinSiegeEntity[]> {
        // Députés en mandat le jour du scrutin (mandat ASSEMBLEE couvrant la date), avec leur
        // siège. Groupe : celui du vote s'il a voté, sinon son groupe ce jour-là.
        return prisma.$queryRaw<ScrutinSiegeEntity[]>`
            WITH s AS (
                SELECT uid, legislature_snapshot AS legislature, date_scrutin
                FROM scrutins
                WHERE uid = ${uid}
            )
            SELECT
                m.mandature_place_hemicycle::int                AS place,
                m.acteur_uid                                    AS depute_uid,
                a.prenom,
                a.nom,
                COALESCE(rgv.code, grp.code, vd.groupe_id)      AS groupe_code,
                COALESCE(rgv.libelle, grp.libelle)              AS groupe_label,
                vd.position,
                photo.photo_path
            FROM s
            JOIN mandats m
                ON m.legislature = s.legislature
               AND m.type_organe = 'ASSEMBLEE'
               AND m.date_debut <= s.date_scrutin
               AND (m.date_fin IS NULL OR m.date_fin >= s.date_scrutin)
               AND m.mandature_place_hemicycle ~ '^[0-9]+$'
            JOIN acteurs a
                ON a.uid = m.acteur_uid
            LEFT JOIN votes_deputes vd
                ON vd.scrutin_uid = s.uid
               AND vd.depute_id = m.acteur_uid
            LEFT JOIN ref_groupes rgv
                ON rgv.groupe_id = vd.groupe_id
               AND rgv.groupe_legislature = vd.groupe_legislature
            LEFT JOIN LATERAL (
                SELECT rg.code, rg.libelle
                FROM acteurs_groupes ag
                JOIN ref_groupes rg
                    ON rg.groupe_id = ag.groupe_id
                   AND rg.groupe_legislature = ag.groupe_legislature
                WHERE ag.acteur_uid = m.acteur_uid
                  AND ag.groupe_legislature = s.legislature
                  AND ag.date_debut <= s.date_scrutin
                  AND (ag.date_fin IS NULL OR ag.date_fin >= s.date_scrutin)
                ORDER BY (rg.code LIKE 'NI%')::int, ag.date_debut DESC
                LIMIT 1
            ) grp ON TRUE
            -- Photo : celle de la législature du scrutin, à défaut la plus récente.
            LEFT JOIN LATERAL (
                SELECT NULLIF(rap.photo_path, 'null') AS photo_path
                FROM ref_acteurs_photos rap
                WHERE rap.acteur_uid = m.acteur_uid
                ORDER BY (rap.legislature = s.legislature) DESC, rap.legislature DESC
                LIMIT 1
            ) photo ON TRUE
        `;
    },
};

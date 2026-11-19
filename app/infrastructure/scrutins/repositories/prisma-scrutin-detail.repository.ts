"server-only";

import { IScrutinDetailRepository } from "@/app/domains/scrutins/repositories/IScrutinDetailRepository";
import { ScrutinDetailEntity } from "@/app/domains/scrutins/entities/scrutin-detail.entity";
import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";
import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";
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
};

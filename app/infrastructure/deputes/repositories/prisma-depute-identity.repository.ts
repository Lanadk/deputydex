"server-only";

import { IDeputeIdentityRepository } from "@/app/domains/deputes/repositories/IDeputeIdentityRepository";
import { DeputeIdentityEntity } from "@/app/domains/deputes/entities/depute-identity.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeIdentityRepository: IDeputeIdentityRepository = {
    async getDeputeIdentity(uid: string, legislature: number): Promise<DeputeIdentityEntity | null> {
        const rows = await prisma.$queryRaw<DeputeIdentityEntity[]>`
            SELECT
                a.uid,
                a.prenom,
                a.nom,
                a.civilite,
                a.date_naissance,
                a.profession_libelle,
                a.profession_categorie,
                a.profession_famille,
                rap.photo_path,
                rg.code   AS groupe_code,
                rg.libelle AS groupe_label,
                (
                    ag.groupe_id IS NOT NULL
                    AND (ag.date_fin IS NULL OR (pl.end_date IS NOT NULL AND ag.date_fin >= pl.end_date))
                ) AS groupe_actif,
                m.election_region      AS region,
                m.election_departement AS departement,
                m.election_num_circo   AS num_circo
            FROM acteurs a
            LEFT JOIN LATERAL (
                SELECT NULLIF(photo_path, 'null') AS photo_path
                FROM ref_acteurs_photos
                WHERE acteur_uid = a.uid
                ORDER BY legislature DESC
                LIMIT 1
            ) rap ON true
            -- Dernière appartenance à un groupe pour cette législature : on ne filtre plus sur
            -- date_fin IS NULL, sinon tout mandat/groupe terminé avant "aujourd'hui" (législature
            -- passée, ou fin de mandat anticipée : démission, nomination au gouvernement, reprise
            -- de siège par le titulaire...) ressort sans groupe. On prend la ligne la plus récente
            -- et on qualifie séparément si elle est toujours active (groupe_actif).
            LEFT JOIN LATERAL (
                SELECT groupe_id, date_fin
                FROM acteurs_groupes
                WHERE acteur_uid = a.uid
                  AND groupe_legislature = ${legislature}
                ORDER BY date_debut DESC
                LIMIT 1
            ) ag ON true
            LEFT JOIN ref_groupes rg
                ON rg.groupe_id = ag.groupe_id
               AND rg.groupe_legislature = ${legislature}
            LEFT JOIN param_legislatures pl
                ON pl.number = ${legislature}
            LEFT JOIN LATERAL (
                SELECT election_region, election_departement, election_num_circo
                FROM mandats
                WHERE acteur_uid = a.uid
                  AND legislature = ${legislature}
                  AND type_organe = 'ASSEMBLEE'
                ORDER BY date_debut DESC
                LIMIT 1
            ) m ON true
            WHERE a.uid = ${uid}
            LIMIT 1
        `;
        return rows[0] ?? null;
    },
};

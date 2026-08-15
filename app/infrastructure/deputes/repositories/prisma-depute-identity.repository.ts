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
            LEFT JOIN acteurs_groupes ag
                ON ag.acteur_uid = a.uid
               AND ag.groupe_legislature = ${legislature}
               AND ag.date_fin IS NULL
            LEFT JOIN ref_groupes rg
                ON rg.groupe_id = ag.groupe_id
               AND rg.groupe_legislature = ${legislature}
            LEFT JOIN mandats m
                ON m.acteur_uid = a.uid
               AND m.legislature = ${legislature}
               AND m.type_organe = 'ASSEMBLEE'
               AND m.date_fin IS NULL
            WHERE a.uid = ${uid}
            LIMIT 1
        `;
        return rows[0] ?? null;
    },
};

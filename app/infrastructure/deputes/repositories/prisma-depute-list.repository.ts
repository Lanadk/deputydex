"server-only";

import { IDeputeListRepository } from "@/app/domains/deputes/repositories/IDeputeListRepository";
import { DeputeListItemEntity } from "@/app/domains/deputes/entities/depute-list-item.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeListRepository: IDeputeListRepository = {
    async getDeputesList(legislature: number): Promise<DeputeListItemEntity[]> {
        return prisma.$queryRaw<DeputeListItemEntity[]>`
            SELECT
                a.uid,
                a.prenom,
                a.nom,
                rap.photo_path,
                grp.groupe_code,
                grp.groupe_label
            FROM public.acteurs a
            JOIN public.mandats m
                ON m.acteur_uid = a.uid
               AND m.legislature = ${legislature}
               AND m.type_organe = 'ASSEMBLEE'
               AND m.date_fin IS NULL
            LEFT JOIN LATERAL (
                SELECT NULLIF(photo_path, 'null') AS photo_path
                FROM public.ref_acteurs_photos
                WHERE acteur_uid = a.uid
                ORDER BY legislature DESC
                LIMIT 1
            ) rap ON true
            LEFT JOIN LATERAL (
                SELECT rg.code AS groupe_code, rg.libelle AS groupe_label
                FROM public.acteurs_groupes ag
                JOIN public.ref_groupes rg
                    ON rg.groupe_id = ag.groupe_id
                   AND rg.groupe_legislature = ${legislature}
                WHERE ag.acteur_uid = a.uid
                  AND ag.groupe_legislature = ${legislature}
                  AND ag.date_debut <= CURRENT_DATE
                  AND (ag.date_fin IS NULL OR ag.date_fin >= CURRENT_DATE)
                ORDER BY (rg.code IN ('NI', 'NI-17'))::int ASC,
                         ag.date_fin DESC NULLS FIRST,
                         ag.date_debut DESC
                LIMIT 1
            ) grp ON true
            ORDER BY a.nom ASC
        `;
    },
};

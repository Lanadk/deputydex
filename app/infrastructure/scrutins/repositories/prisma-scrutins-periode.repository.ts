"server-only";

import { IScrutinsPeriodeRepository, ScrutinsPeriodeEntity } from "@/app/domains/scrutins/repositories/IScrutinsPeriodeRepository";
import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { OBJET_SQL } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-list.repository";

export const prismaScrutinsPeriodeRepository: IScrutinsPeriodeRepository = {
    async getScrutinsDernierMois(legislature: number): Promise<ScrutinsPeriodeEntity | null> {
        try {
            const [periode] = await prisma.$queryRaw<{ debut: Date | null; fin: Date | null }[]>`
                SELECT (MAX(date_scrutin) - 29) AS debut, MAX(date_scrutin) AS fin
                FROM scrutins
                WHERE legislature_snapshot = ${legislature}
            `;
            if (!periode?.debut || !periode.fin) return null;

            const rows = await prisma.$queryRaw<ScrutinListItemEntity[]>`
                SELECT
                    s.uid,
                    s.numero,
                    s.date_scrutin,
                    s.titre,
                    s.type_scrutin_code,
                    s.type_scrutin_libelle,
                    s.resultat_code,
                    ${OBJET_SQL} AS objet,
                    a.total_pour,
                    a.total_contre,
                    a.total_abstentions
                FROM scrutins s
                LEFT JOIN scrutins_agregats a
                    ON a.scrutin_uid = s.uid
                WHERE s.legislature_snapshot = ${legislature}
                  AND s.date_scrutin BETWEEN ${periode.debut} AND ${periode.fin}
            `;
            return { debut: periode.debut, fin: periode.fin, rows };
        } catch (error) {
            throw new Error(`Failed to read last month scrutins for legislature ${legislature}`, { cause: error });
        }
    },
};

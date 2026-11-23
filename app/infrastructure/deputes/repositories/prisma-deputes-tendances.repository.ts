"server-only";

import { IDeputesTendancesRepository } from "@/app/domains/deputes/repositories/IDeputesTendancesRepository";
import { DeputeTendanceEntity } from "@/app/domains/deputes/entities/deputes-tendances.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputesTendancesRepository: IDeputesTendancesRepository = {
    async getDeputesTendances(legislature: number): Promise<DeputeTendanceEntity[]> {
        try {
            // Jointure interne sur les cartes : un député sans carte (nom, groupe, photo)
            // ne peut pas être affiché, il n'entre pas dans les classements.
            return await prisma.$queryRaw<DeputeTendanceEntity[]>`
                SELECT
                    t.depute_uid,
                    c.depute_full_name,
                    c.depute_groupe_code,
                    c.depute_image,
                    c.depute_role,
                    t.periode_debut,
                    t.periode_fin,
                    t.scrutins_periode,
                    t.votes_exprimes,
                    t.votes_rebelles,
                    t.amendements_deposes
                FROM agg_deputes_tendances_recentes t
                JOIN agg_deputes_cards c
                    ON c.depute_uid = t.depute_uid
                    AND c.legislature = t.legislature
                WHERE t.legislature = ${legislature}
            `;
        } catch (error) {
            throw new Error(`Failed to read deputes tendances for legislature ${legislature}`, { cause: error });
        }
    },
};

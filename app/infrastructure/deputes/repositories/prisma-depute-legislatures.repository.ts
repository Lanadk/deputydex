"server-only";

import { IDeputeLegislaturesRepository } from "@/app/domains/deputes/repositories/IDeputeLegislaturesRepository";
import { DeputeLegislatureEntity } from "@/app/domains/deputes/entities/depute-legislatures.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeLegislaturesRepository: IDeputeLegislaturesRepository = {
    async getDeputeLegislatures(uid: string): Promise<DeputeLegislatureEntity[]> {
        return prisma.$queryRaw<DeputeLegislatureEntity[]>`
            SELECT DISTINCT legislature
            FROM mandats
            WHERE acteur_uid = ${uid}
              AND type_organe = 'ASSEMBLEE'
            ORDER BY legislature
        `;
    },
};

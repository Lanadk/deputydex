"server-only";

import { IDeputeMandatRepository } from "@/app/domains/deputes/repositories/IDeputeMandatRepository";
import { DeputeMandatEntity } from "@/app/domains/deputes/entities/depute-mandat.entity";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

export const prismaDeputeMandatsRepository: IDeputeMandatRepository = {
    async getDeputeMandats(uid: string): Promise<DeputeMandatEntity[]> {
        return prisma.$queryRaw<DeputeMandatEntity[]>`
            SELECT
                m.uid,
                m.type_organe,
                m.lib_qualite,
                m.date_debut,
                m.date_fin,
                m.organe_uid,
                m.legislature
            FROM mandats m
            WHERE m.acteur_uid = ${uid}
            ORDER BY m.date_debut DESC
        `;
    },
};

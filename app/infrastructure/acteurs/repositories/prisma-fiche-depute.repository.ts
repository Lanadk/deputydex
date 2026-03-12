"server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import {ActeurWithMandatsEntity} from "@/app/domains/acteurs/entities/acteurs-mandats.entity";
import {IFicheDeputeRepository} from "@/app/domains/acteurs/repositories/IFIcheDeputeRepository";

export const prismaFicheDeputeRepository: IFicheDeputeRepository = {
    async findByIdAndLegislature(id, legislature): Promise<ActeurWithMandatsEntity | null> {
        return prisma.acteurs.findUnique({
            where: { uid: id },
            include: {
                mandats: {
                    where: { legislature_snapshot: legislature, type_organe: "ASSEMBLEE" },
                },
                photos: {
                    where: { legislature },
                },
            },
        });
    },
};
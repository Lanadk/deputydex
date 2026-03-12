"server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import {ActeurWithMandatsEntity} from "@/app/domains/acteurs/entities/acteurs-mandats.entity";
import {IFicheDeputeRepository} from "@/app/domains/acteurs/repositories/IFIcheDeputeRepository";

export const prismaFicheDeputeRepository: IFicheDeputeRepository = {
    async findByIdAndLegislature(id): Promise<ActeurWithMandatsEntity | null> {
        return prisma.acteurs.findUnique({
            where: { uid: id },
            include: {
                mandats: true,
                photos: {
                    where: { acteurUid: id },
                },
                groupes: {
                    orderBy: { date_debut: 'desc' },
                    take: 1,
                    include: {
                        groupe: {
                            include: {
                                partis: true,
                            }
                        }
                    }
                }
            },
        });
    },
};
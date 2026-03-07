import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import type { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";
import {LegislatureEntity} from "@/app/domains/legislatures/entities/legislature.entity";

export const prismaLegislaturesRepository: ILegislaturesRepository = {
    async getCurrent(): Promise<LegislatureEntity | null> {
        return prisma.paramLegislature.findFirst({
            where: {
                currentLegislatures: {
                    some: {},
                },
            },
            select: {
                id: true,
                number: true,
                startDate: true,
                endDate: true,
            },
        });
    },

    async getAll(): Promise<LegislatureEntity[]> {
        return prisma.paramLegislature.findMany({
            orderBy: { number: "desc" },
            select: {
                id: true,
                number: true,
                startDate: true,
                endDate: true,
            },
        });
    },
};
import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import type { ILegislaturesRepository } from "@/app/domains/legislatures/repositories/ILegislaturesRepository";

export const prismaLegislaturesRepository: ILegislaturesRepository = {
    async getCurrent() {
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

    async getAll() {
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
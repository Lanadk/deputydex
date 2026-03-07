// app/infrastructure/acteurs/repositories/prisma-acteurs.repository.ts
import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import {IActeursRepository} from "@/app/domains/acteurs/repositories/IActeursRepository";

export const prismaActeursRepository: IActeursRepository = {
    async search(query: FilterBarQuery, page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const [items, total] = await Promise.all([
            prisma.acteurs.findMany({
                where: query.where as any,
                orderBy: query.orderBy as any,
                skip,
                take,
            }),
            prisma.acteurs.count({
                where: query.where as any,
            }),
        ]);

        return { items, total };
    },

    async findManyForExport(query: FilterBarQuery, maxRows: number) {
        return prisma.acteurs.findMany({
            where: query.where as any,
            orderBy: query.orderBy as any,
            take: maxRows,
        });
    },
};
import "server-only";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import type { FilterBarQuery } from "@/app/component-library/molecules/filter-bar/filter-bar.types";
import { sanitizeFilterBarQuery } from "@/app/lib/utils/filterbar-sanitize";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/lib/filters/acteurs.filters";
import { mapActeursToDTO } from "@/app/lib/mappers/acteur.mapper";

const SANITIZE_OPTIONS = {
    allowedFilterFields: ACTEURS_FILTER_FIELDS.map((f) => f.field),
    allowedSortFields: ACTEURS_SORT_OPTIONS.map((s) => s.field),
};

export async function searchActeurs(rawQuery: FilterBarQuery, page = 1, pageSize = 20) {
    const query = sanitizeFilterBarQuery(rawQuery, SANITIZE_OPTIONS);

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [items, total] = await Promise.all([
        prisma.acteurs.findMany({
            where: query.where as any,
            orderBy: query.orderBy as any,
            skip,
            take,
        }),
        prisma.acteurs.count({ where: query.where as any }),
    ]);

    const dtoItems = mapActeursToDTO(items);
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    return { items: dtoItems, total, page, pageSize, pageCount };
}
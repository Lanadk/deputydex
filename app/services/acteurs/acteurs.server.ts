import "server-only";

import { prisma } from "@/app/lib/prisma/prisma";
import type { FilterBarQuery } from "@/app/component-library/molecules/filter-bar/filter-bar.types";
import { sanitizeFilterBarQuery } from "@/app/lib/utils/filterbar-sanitize";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/lib/filters/acteurs.filters";
import { mapActeursToDTO } from "@/app/lib/mappers/acteur.mapper";

const SANITIZE_OPTIONS = {
    allowedFilterFields: ACTEURS_FILTER_FIELDS.map((f) => f.field),
    allowedSortFields: ACTEURS_SORT_OPTIONS.map((s) => s.field),
};

export async function listActeurs() {
    const acteurs = await prisma.acteurs.findMany();
    return mapActeursToDTO(acteurs);
}

export async function searchActeurs(rawQuery: FilterBarQuery) {
    const query = sanitizeFilterBarQuery(rawQuery, SANITIZE_OPTIONS);

    const acteurs = await prisma.acteurs.findMany({
        where: query.where as any,
        orderBy: query.orderBy as any,
    });

    return mapActeursToDTO(acteurs);
}
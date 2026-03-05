import { NextResponse } from "next/server";
import type { FilterBarQuery } from "@/app/component-library/molecules/filter-bar/filter-bar.types";
import { prisma } from "@/app/lib/prisma/prisma";
import { sanitizeFilterBarQuery } from "@/app/lib/utils/filterbar-sanitize";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/lib/filters/acteurs.filters";
import { mapActeursToDTO } from "@/app/lib/mappers/acteur.mapper";

const SANITIZE_OPTIONS = {
    allowedFilterFields: ACTEURS_FILTER_FIELDS.map((f) => f.field),
    allowedSortFields: ACTEURS_SORT_OPTIONS.map((s) => s.field),
};

type SearchBody = {
    query?: FilterBarQuery;
    page?: number;
    pageSize?: number;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as SearchBody;

        const rawQuery = body?.query ?? { orderBy: [], where: {} };
        const query = sanitizeFilterBarQuery(rawQuery, SANITIZE_OPTIONS);

        const page = Math.max(1, body?.page ?? 1);
        const pageSize = Math.min(200, Math.max(1, body?.pageSize ?? 20));
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

        const dtoItems = mapActeursToDTO(items);
        const pageCount = Math.max(1, Math.ceil(total / pageSize));

        return NextResponse.json({
            items: dtoItems,
            total,
            page,
            pageSize,
            pageCount,
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to search acteurs" }, { status: 500 });
    }
}
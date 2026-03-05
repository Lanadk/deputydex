import { NextResponse } from "next/server";
import type { FilterBarQuery } from "@/app/component-library/molecules/filter-bar/filter-bar.types";
import { searchActeurs } from "@/app/services/acteurs/acteurs.server";

type SearchBody = { query?: FilterBarQuery; page?: number; pageSize?: number };

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as SearchBody;
        const query = body?.query ?? { orderBy: [], where: {} };
        const page = body?.page ?? 1;
        const pageSize = body?.pageSize ?? 20;

        const result = await searchActeurs(query, page, pageSize);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to search acteurs" }, { status: 500 });
    }
}
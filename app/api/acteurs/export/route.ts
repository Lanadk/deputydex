import { NextResponse } from "next/server";
import type { FilterBarQuery } from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar.types";
import { exportActeurs, type ExportFormat } from "@/app/services/acteurs/acteurs.export.server";

type Body = {
    query?: FilterBarQuery;
    format?: ExportFormat; // "csv" | "json"
    maxRows?: number;
    delimiter?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Body;

        const rawQuery = body?.query ?? { orderBy: [], where: {} };
        const format: ExportFormat = body?.format ?? "csv";

        const result = await exportActeurs(rawQuery, {
            format,
            maxRows: body?.maxRows ?? 5000,
            delimiter: body?.delimiter ?? ";",
        });

        return new NextResponse(result.body, {
            status: 200,
            headers: {
                "Content-Type": result.contentType,
                "Content-Disposition": `attachment; filename="${result.filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to export" }, { status: 500 });
    }
}
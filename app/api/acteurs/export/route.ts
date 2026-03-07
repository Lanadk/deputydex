import { NextResponse } from "next/server";
import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import { exportActeurs } from "@/app/services/acteurs/acteurs.export.server";
import {ExportFormat} from "@/app/_shared/export/export.types";

type Body = {
    query?: FilterBarQuery;
    format?: ExportFormat;
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
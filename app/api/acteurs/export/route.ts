import { NextResponse } from "next/server";
import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import type {ExportFormat} from "@/app/_shared/export/export.types";
import { exportActeursUseCase } from "@/app/domains/acteurs/use-cases/export-acteurs.use-case";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";
import {isOk} from "@/app/_shared/result-pattern/result";

type Body = {
    query?: FilterBarQuery;
    format?: ExportFormat;
    maxRows?: number;
    delimiter?: string;
};

export async function POST(
    req: Request
): Promise<Response> {
    try {
        const body = (await req.json()) as Body;

        const rawQuery = body?.query ?? { orderBy: [], where: {} };
        const format: ExportFormat = body?.format ?? "csv";

        const result = await exportActeursUseCase(
            prismaActeursRepository,
            rawQuery,
            {
                format,
                maxRows: body?.maxRows ?? 5000,
                delimiter: body?.delimiter ?? ";",
            }
        );

        if (isOk(result)) {
            return new NextResponse(result.data.body, {
                status: 200,
                headers: {
                    "Content-Type": result.data.contentType,
                    "Content-Disposition": `attachment; filename="${result.data.filename}"`,
                    "Cache-Control": "no-store",
                },
            });
        }

        return NextResponse.json({ error: "Failed to export" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to export" }, { status: 500 });
    }
}
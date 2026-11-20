import { NextResponse } from "next/server";
import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import type {ExportFormat} from "@/app/_shared/export/export.types";
import { exportActeursUseCase } from "@/app/domains/acteurs/use-cases/export-acteurs.use-case";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";
import {err, isErr} from "@/app/_shared/result-pattern/result";
import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";

type Body = {
    query?: FilterBarQuery;
    format?: ExportFormat;
    maxRows?: number;
    delimiter?: string;
};

export async function POST(
    req: Request
): Promise<Response> {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body) return resultToResponse(err("INVALID_INPUT"), { INVALID_INPUT: "Corps JSON invalide" });

    const rawQuery = body.query ?? { orderBy: [], where: {} };
    const format: ExportFormat = body.format ?? "csv";

    const result = await exportActeursUseCase(
        prismaActeursRepository,
        rawQuery,
        {
            format,
            maxRows: body.maxRows ?? 5000,
            delimiter: body.delimiter ?? ";",
        }
    );

    if (isErr(result)) return resultToResponse(result);

    // Succès : un fichier à télécharger, pas du JSON mis en cache.
    return new NextResponse(result.data.body, {
        status: 200,
        headers: {
            "Content-Type": result.data.contentType,
            "Content-Disposition": `attachment; filename="${result.data.filename}"`,
            "Cache-Control": "no-store",
        },
    });
}

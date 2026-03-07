import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import type { FilterBarQuery } from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar.types";
import { sanitizeFilterBarQuery } from "@/app/lib/utils/filterbar-sanitize";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/lib/filters/acteurs.filters";
import { mapActeursToDTO } from "@/app/infrastructure/acteurs/mappers/acteur.mapper";
import { toCsv, type CsvColumn } from "@/app/lib/utils/export/csv";
import type { ActeurDTO } from "@/app/domains/acteurs/dto/acteur.dto";

const SANITIZE_OPTIONS = {
    allowedFilterFields: ACTEURS_FILTER_FIELDS.map((f) => f.field),
    allowedSortFields: ACTEURS_SORT_OPTIONS.map((s) => s.field),
};

export type ExportFormat = "csv" | "json";

type ExportOpts = {
    format: ExportFormat;
    maxRows?: number;     // sécurité
    delimiter?: string;   // pour CSV
};

export async function exportActeurs(rawQuery: FilterBarQuery, opts: ExportOpts) {
    const query = sanitizeFilterBarQuery(rawQuery, SANITIZE_OPTIONS);

    const maxRows = Math.min(Math.max(1, opts.maxRows ?? 5000), 20000);

    const acteurs = await prisma.acteurs.findMany({
        where: query.where as any,
        orderBy: query.orderBy as any,
        take: maxRows,
    });

    const dto = mapActeursToDTO(acteurs);

    if (opts.format === "json") {
        const filename = `acteurs_export_${new Date().toISOString().slice(0, 10)}.json`;
        return { contentType: "application/json; charset=utf-8", filename, body: JSON.stringify(dto, null, 2) };
    }

    const columns: CsvColumn<ActeurDTO>[] = [
        { header: "id", value: (a) => a.id },
        { header: "prenom", value: (a) => a.prenom ?? "" },
        { header: "nom", value: (a) => a.nom ?? "" },
        { header: "profession_categorie", value: (a) => a.professionCategorie ?? "" },
        { header: "date_naissance", value: (a) => a.dateNaissance ?? "" },
    ];

    const delimiter = opts.delimiter ?? ";";
    const csv = toCsv(dto, columns, { delimiter, includeBom: true });

    const filename = `acteurs_export_${new Date().toISOString().slice(0, 10)}.csv`;
    return { contentType: "text/csv; charset=utf-8", filename, body: csv };
}
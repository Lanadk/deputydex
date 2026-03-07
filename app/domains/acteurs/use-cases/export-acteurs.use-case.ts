import "server-only";

import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import type { ExportFormat } from "@/app/_shared/export/export.types";
import { toCsv, type CsvColumn } from "@/app/_shared/export/csv";
import { sanitizeFilterBarQuery } from "@/app/infrastructure/filtering/filter-bar-sanitize";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/domains/acteurs/filters/acteurs.filters";
import type { ActeurDTO } from "@/app/domains/acteurs/dto/acteur.dto";
import { mapActeursToDTO } from "@/app/infrastructure/acteurs/mappers/acteur.mapper";
import {IActeursRepository} from "@/app/domains/acteurs/repositories/IActeursRepository";

const SANITIZE_OPTIONS = {
    allowedFilterFields: ACTEURS_FILTER_FIELDS.map((f) => f.field),
    allowedSortFields: ACTEURS_SORT_OPTIONS.map((s) => s.field),
};

type ExportOpts = {
    format: ExportFormat;
    maxRows?: number;
    delimiter?: string;
};

export async function exportActeursUseCase(
    repository: IActeursRepository,
    rawQuery: FilterBarQuery,
    opts: ExportOpts
) {
    const query = sanitizeFilterBarQuery(rawQuery, SANITIZE_OPTIONS);

    const maxRows = Math.min(Math.max(1, opts.maxRows ?? 5000), 20000);

    const rows = await repository.findManyForExport(query, maxRows);
    const dto = mapActeursToDTO(rows as any[]);

    if (opts.format === "json") {
        const filename = `acteurs_export_${new Date().toISOString().slice(0, 10)}.json`;
        return {
            contentType: "application/json; charset=utf-8",
            filename,
            body: JSON.stringify(dto, null, 2),
        };
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

    return {
        contentType: "text/csv; charset=utf-8",
        filename,
        body: csv,
    };
}
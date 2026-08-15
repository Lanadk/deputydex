import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { CsvColumn } from "@/app/_shared/export/csv";

type ExportRow = Record<string, string | number | null | undefined>;

/**
 * Normalise n'importe quelle RawStatData en lignes exportables (CSV/JSON) —
 * consommé par exportRows() (app/(ui)/utils/export-rows.ts), le même
 * utilitaire déjà utilisé par BlockTableRenderer.
 */
export function toExportRows(data: RawStatData): { rows: ExportRow[]; csvColumns: CsvColumn<ExportRow>[] } {
    switch (data.shape) {
        case "distribution":
            return {
                rows: data.items,
                csvColumns: [
                    { header: "Libellé", value: (r) => r.label },
                    { header: "Valeur", value: (r) => r.value },
                ],
            };

        case "timeseries":
            return {
                rows: data.points,
                csvColumns: [
                    { header: "Période", value: (r) => r.label },
                    { header: "Valeur", value: (r) => r.value },
                ],
            };

        case "multi-series":
            return {
                rows: data.series.flatMap((serie) =>
                    serie.items.map((item) => ({ serie: serie.name, label: item.label, value: item.value }))
                ),
                csvColumns: [
                    { header: "Série", value: (r) => r.serie },
                    { header: "Libellé", value: (r) => r.label },
                    { header: "Valeur", value: (r) => r.value },
                ],
            };

        case "points":
            return {
                rows: data.points.map((point) => ({ label: point.label ?? "", x: point.x, y: point.y })),
                csvColumns: [
                    { header: "Libellé", value: (r) => r.label },
                    { header: "X", value: (r) => r.x },
                    { header: "Y", value: (r) => r.y },
                ],
            };

        case "scalar":
            return {
                rows: [{ label: data.label ?? "", value: data.value }],
                csvColumns: [
                    { header: "Libellé", value: (r) => r.label },
                    { header: "Valeur", value: (r) => r.value },
                ],
            };
    }
}

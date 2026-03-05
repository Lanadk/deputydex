import {CsvColumn, toCsv} from "@/app/lib/utils/export/csv";

type ExportOptions<T> = {
    /** base sans extension (ex: "acteurs_export") */
    filenameBase: string;

    /** csv: colonnes (ordre + format). requis si format="csv" */
    csvColumns?: CsvColumn<T>[];

    /** csv options */
    delimiter?: string;   // default ";"
    includeBom?: boolean; // default true

    /** si true => ajoute _YYYY-MM-DD au filename */
    addDateSuffix?: boolean; // default true

    /** json: pretty print */
    jsonPretty?: boolean; // default true
};

export type ExportFormat = "csv" | "json";

export function exportRows<T>(
    rows: T[],
    format: ExportFormat,
    opts: ExportOptions<T>
) {
    const addDateSuffix = opts.addDateSuffix ?? true;
    const dateSuffix = addDateSuffix ? `_${new Date().toISOString().slice(0, 10)}` : "";
    const base = `${opts.filenameBase}${dateSuffix}`;

    if (format === "json") {
        const json = opts.jsonPretty ?? true
            ? JSON.stringify(rows, null, 2)
            : JSON.stringify(rows);

        downloadTextFile(json, `${base}.json`, "application/json;charset=utf-8");
        return;
    }

    // csv
    const cols = opts.csvColumns;
    if (!cols || cols.length === 0) {
        throw new Error('exportRows: "csvColumns" is required when format="csv"');
    }

    const csv = toCsv(rows, cols, {
        delimiter: opts.delimiter ?? ";",
        includeBom: opts.includeBom ?? true,
    });

    downloadTextFile(csv, `${base}.csv`, "text/csv;charset=utf-8");
}

function downloadTextFile(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
export type CsvColumn<T> = {
    header: string;
    value: (row: T) => string | number | boolean | null | undefined;
};

function escapeCsvCell(input: string, delimiter: string) {
    // RFC4180-ish
    const mustQuote =
        input.includes('"') ||
        input.includes("\n") ||
        input.includes("\r") ||
        input.includes(delimiter);

    const escaped = input.replace(/"/g, '""');
    return mustQuote ? `"${escaped}"` : escaped;
}

export function toCsv<T>(
    rows: T[],
    columns: CsvColumn<T>[],
    opts?: { delimiter?: string; includeBom?: boolean }
) {
    const delimiter = opts?.delimiter ?? ";";
    const includeBom = opts?.includeBom ?? true;

    const headerLine = columns.map((c) => escapeCsvCell(String(c.header ?? ""), delimiter)).join(delimiter);

    const lines = rows.map((row) =>
        columns
            .map((c) => {
                const v = c.value(row);
                const s = v === null || v === undefined ? "" : String(v);
                return escapeCsvCell(s, delimiter);
            })
            .join(delimiter)
    );

    const csv = [headerLine, ...lines].join("\n");
    // BOM utile pour Excel (UTF-8)
    return includeBom ? `\uFEFF${csv}` : csv;
}
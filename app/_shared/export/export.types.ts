export type ExportFormat = "csv" | "json";

export type ExportResult = {
    contentType: string,
    filename: string,
    body: string
};
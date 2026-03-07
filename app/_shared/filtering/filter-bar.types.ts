export type SortDirection = "asc" | "desc";
export type ApplyMode = "auto" | "manual";

export interface SortOption {
    id: string;
    label: string;
    field: string;
    direction: SortDirection;
}

export interface FilterField {
    field: string;
    label: string;
    type: "string" | "date" | "number" | "enum" | "select";
    selectOptions?: { value: string; label: string }[];
    enumValues?: string[];
}

export interface ActiveFieldFilter {
    operator: string;
    value: string;
}

export interface FilterBarQuery {
    orderBy: Record<string, SortDirection>[];
    where: Record<string, unknown>;
}
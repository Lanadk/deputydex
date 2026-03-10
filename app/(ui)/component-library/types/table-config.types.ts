import { ColumnDef } from "@/app/(ui)/component-library/molecules/table/table-lib";
import { SortOption, FilterField } from "@/app/_shared/filtering/filter-bar.types";
import { CsvColumn } from "@/app/_shared/export/csv";

//Options composants optionnels

export type TablePaginationConfig = {
    pageSize?: number; // défaut : 10
};

export type TableFilterConfig = {
    sortOptions: SortOption[];
    filterFields: FilterField[];
    applyMode: "auto" | "manual";
};

export type TableExportConfig<TRow> = {
    filenameBase: string;
    csvColumns: CsvColumn<TRow>[];
    delimiter?: string;       // défaut : ";"
    includeBom?: boolean;     // défaut : true
    addDateSuffix?: boolean;  // défaut : true
};

//Config principale
export type TableConfig<TRow = unknown> = {
    id: string;
    title?: string;
    subtitle?: string;
    /** Fetch des données selon la législature */
    gatewayFn: (legislature: number) => Promise<TRow[]>;
    columns: ColumnDef<TRow>[];
    getRowKey: (row: TRow) => string;
    /** Activer la pagination locale */
    pagination?: TablePaginationConfig;
    /** Activer le filtre */
    filter?: TableFilterConfig;
    /** Activer l'export CSV / JSON */
    export?: TableExportConfig<TRow>;
};
import { ColumnDef } from "@/app/(ui)/component-library/molecules/table/table-lib";
import { SortOption, FilterField } from "@/app/_shared/filtering/filter-bar.types";
import { CsvColumn } from "@/app/_shared/export/csv";

//Options composants optionnels

export type TablePaginationConfig = {
    pageSize?: number; // défaut : 10
};

export type TableFilterConfig<TRow = unknown> = {
    sortOptions: SortOption[] | undefined;
    filterFields: FilterField[] | undefined;
    applyMode: "auto" | "manual";
    /**
     * Options d'un filtre `select` calculées depuis les lignes chargées
     * (clé = `field` du FilterField), quand elles dépendent des données (ex:
     * les groupes de LA législature affichée) plutôt que d'une liste fixe.
     * Remplace `selectOptions` du champ correspondant.
     */
    selectOptionsFromRows?: Record<string, (rows: TRow[]) => { value: string; label: string }[]>;
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
    columns: ColumnDef<TRow>[];
    getRowKey: (row: TRow) => string;
    /** Activer la pagination locale */
    pagination?: TablePaginationConfig;
    /** Activer le filtre */
    filter?: TableFilterConfig<TRow>;
    /** Activer l'export CSV / JSON */
    export?: TableExportConfig<TRow>;
};
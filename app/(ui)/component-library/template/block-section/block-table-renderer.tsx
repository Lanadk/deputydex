"use client";

import React, {useEffect, useMemo, useState} from "react";
import { TableLib } from "@/app/(ui)/component-library/molecules/table/table-lib";
import { FilterBarLib } from "../../molecules/filter-bar/filter-bar-lib";
import {TableExportActions} from "@/app/(ui)/component-library/molecules/table/components/table-export-actions";
import {exportRows} from "@/app/(ui)/utils/export-rows";
import {TableConfig} from "@/app/(ui)/component-library/types/table-config.types";
import {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {
    AnyRow,
    applyFilterBarQueryClient
} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";
import {TablePaginationLib} from "@/app/(ui)/component-library/molecules/table/components/table-pagination-lib";


interface BlockTableRendererProps {
    config: TableConfig;
    legislature: number;
}

/**
 * BlockTableRenderer
 * Fetch les données via gatewayFn et les passe à TableLib.
 */
export function BlockTableRenderer({ config, legislature }: BlockTableRendererProps) {
    const pageSize = config.pagination?.pageSize ?? 10;

    //Données brutes
    const [allRows, setAllRows] = useState<AnyRow[]>([]);
    const [loading, setLoading]  = useState(true);

    useEffect(() => {
        setLoading(true); //TODO fix
        config.gatewayFn(legislature)
            .then((rows) => setAllRows(rows as Record<string, unknown>[]))
            .finally(() => setLoading(false));
    }, [legislature, config.id]);

    //Filtre
    const [query, setQuery] = useState<FilterBarQuery>({ orderBy: [], where: {} });
    const [page,  setPage]  = useState(1);

    const filteredRows = useMemo(() => {
        if (!config.filter) return allRows;
        return applyFilterBarQueryClient(allRows, query);
    }, [allRows, query, config.filter]);

    const handleQueryChange = (q: FilterBarQuery) => {
        setPage(1);
        setQuery(q);
    };

    //Pagination
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));

    const pageRows = useMemo(() => {
        if (!config.pagination) return filteredRows;
        const start = (page - 1) * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, page, pageSize, config.pagination]);


    return (
        <div className="chart-lib flex flex-col gap-3">

            {/* Header titre / sous-titre */}
            {(config.title || config.subtitle) && (
                <div className="chart-lib__header">
                    {config.title    && <span className="chart-lib__title">{config.title}</span>}
                    {config.subtitle && <span className="chart-lib__subtitle text-xs">{config.subtitle}</span>}
                </div>
            )}

            {/* FilterBar */}
            {config.filter && (
                <FilterBarLib
                    sortOptions={config.filter.sortOptions}
                    filterFields={config.filter.filterFields}
                    applyMode={config.filter.applyMode}
                    onQueryChange={handleQueryChange}
                />
            )}

            {/* Export */}
            {config.export && (
                <TableExportActions
                    title={config.title ?? "Export"}
                    hint={`${filteredRows.length} résultat(s)`}
                    onExportAction={(format) =>
                        exportRows(filteredRows, format, {
                            filenameBase:  config.export!.filenameBase,
                            csvColumns:    config.export!.csvColumns as never,
                            delimiter:     config.export!.delimiter     ?? ";",
                            includeBom:    config.export!.includeBom    ?? true,
                            addDateSuffix: config.export!.addDateSuffix ?? true,
                        })
                    }
                />
            )}

            {/* Table */}
            <TableLib
                rows={pageRows}
                columns={config.columns}
                getRowKeyAction={config.getRowKey}
                loading={loading}
                emptyLabel="Aucun résultat"
            />

            {/* Pagination */}
            {config.pagination && (
                <TablePaginationLib
                    page={page}
                    pageCount={pageCount}
                    total={filteredRows.length}
                    onPrevAction={() => setPage((p) => Math.max(1, p - 1))}
                    onNextAction={() => setPage((p) => Math.min(pageCount, p + 1))}
                />
            )}

        </div>
    );
}
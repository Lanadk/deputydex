"use client";

import React, {useMemo, useState} from "react";
import {TableLib} from "@/app/(ui)/component-library/molecules/table/table-lib";
import {FilterBarLib} from "../../../molecules/filter-bar/filter-bar-lib";
import {TableExportActions} from "@/app/(ui)/component-library/molecules/table/components/table-export-actions";
import {exportRows} from "@/app/(ui)/utils/export-rows";
import {TableConfig} from "@/app/(ui)/component-library/template/block-section/table-config.types";
import {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {AnyRow, applyFilterBarQueryClient} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";
import {TablePaginationLib} from "@/app/(ui)/component-library/molecules/table/components/table-pagination-lib";

interface BlockTableRendererProps {
    config: TableConfig;
    data: unknown[] | null;
    loading: boolean;
}

export function BlockTableRenderer({config, data, loading}: BlockTableRendererProps) {
    const pageSize = config.pagination?.pageSize ?? 10;

    const [query, setQuery] = useState<FilterBarQuery>({orderBy: [], where: {}});
    const [page, setPage] = useState(1);

    const filteredRows = useMemo(() => {
        const allRows = (data ?? []) as AnyRow[];
        if (!config.filter) return allRows;
        return applyFilterBarQueryClient(allRows, query);
    }, [data, query, config.filter]);

    const handleQueryChange = (q: FilterBarQuery) => {
        setPage(1);
        setQuery(q);
    };

    const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));

    const pageRows = useMemo(() => {
        if (!config.pagination) return filteredRows;
        const start = (page - 1) * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, page, pageSize, config.pagination]);

    return (
        <div className="chart-lib flex flex-col gap-3">
            {(config.title || config.subtitle) && (
                <div className="chart-lib__header">
                    {config.title    && <span className="chart-lib__title">{config.title}</span>}
                    {config.subtitle && <span className="chart-lib__subtitle text-xs">{config.subtitle}</span>}
                </div>
            )}

            {config.filter && (
                <FilterBarLib
                    sortOptions={config.filter.sortOptions}
                    filterFields={config.filter.filterFields}
                    applyMode={config.filter.applyMode}
                    onQueryChange={handleQueryChange}
                />
            )}

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

            <TableLib
                rows={pageRows}
                columns={config.columns}
                getRowKeyAction={config.getRowKey}
                loading={loading}
                emptyLabel="Aucun résultat"
            />

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
"use client";

import React, { useMemo, useState } from "react";
import { ExpandableCardLib } from "@/app/(ui)/component-library/molecules/expandable-card/expandable-card-lib";
import { TablePaginationLib } from "@/app/(ui)/component-library/molecules/table/components/table-pagination-lib";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { CheckboxLib } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib";
import { normalizeForSearch } from "@/app/_shared/utils/string";
import { ExpandableCardListConfig } from "@/app/(ui)/component-library/template/sections/block-section/expandable-card-list-config.types";

interface BlockExpandableCardListRendererProps<TRow> {
    config: ExpandableCardListConfig<TRow>;
    data: TRow[] | null;
    loading: boolean;
    params: Record<string, unknown>;
}

export function BlockExpandableCardListRenderer<TRow>({ config, data, loading, params }: BlockExpandableCardListRendererProps<TRow>) {
    const pageSize = config.pageSize ?? 10;
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(config.sortOptions?.[0]?.value ?? "");
    const [activeToggles, setActiveToggles] = useState<Set<string>>(
        () => new Set((config.toggles ?? []).filter((t) => t.defaultChecked).map((t) => t.id))
    );

    // Nouvelles données (ex. changement de législature) : la section n'est pas remontée,
    // on revient donc à la première page plutôt que de rester sur une page qui n'existe plus.
    const [previousData, setPreviousData] = useState(data);
    if (data !== previousData) {
        setPreviousData(data);
        setPage(1);
    }

    const rows = useMemo(() => {
        const needle = normalizeForSearch(search);
        const keeps = (config.toggles ?? []).filter((t) => activeToggles.has(t.id)).map((t) => t.keep);
        const matching = (data ?? []).filter((row) =>
            keeps.every((keep) => keep(row)) &&
            (!needle || normalizeForSearch(config.getSearchText(row)).includes(needle))
        );
        const compare = config.sortOptions?.find((o) => o.value === sort)?.compare;
        return compare ? matching.sort(compare) : matching;
    }, [data, search, sort, activeToggles, config]);
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    // Garde-fou : jamais au-delà de la dernière page, quelle que soit la cause.
    const currentPage = Math.min(page, pageCount);
    const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if ((data ?? []).length === 0) {
        return (
            <div className="chart-lib flex flex-col gap-3">
                {config.title && <span className="chart-lib__title">{config.title}</span>}
                <p className="expandable-card-list__empty">{loading ? "Chargement…" : config.emptyLabel ?? "Aucun résultat"}</p>
            </div>
        );
    }

    return (
        <div className="chart-lib flex flex-col gap-3">
            {(config.title || config.subtitle) && (
                <div className="chart-lib__header">
                    {config.title && <span className="chart-lib__title">{config.title}</span>}
                    {config.subtitle && <span className="chart-lib__subtitle text-xs">{config.subtitle}</span>}
                </div>
            )}

            <div className="expandable-card-list__toolbar">
            <InputLib
                value={search}
                placeholder={config.searchPlaceholder ?? "Rechercher"}
                onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
            />

            {config.sortOptions && config.sortOptions.length > 0 && (
                <SelectLib
                    value={sort}
                    options={config.sortOptions.map(({ value, label }) => ({ value, label }))}
                    placeholder="Trier par"
                    onChange={(value) => {
                        setSort(value);
                        setPage(1);
                    }}
                />
            )}

            {config.toggles?.map((toggle) => (
                <CheckboxLib
                    key={toggle.id}
                    label={toggle.label}
                    isChecked={activeToggles.has(toggle.id)}
                    onToggle={() => {
                        setActiveToggles((prev) => {
                            const next = new Set(prev);
                            if (next.has(toggle.id)) next.delete(toggle.id);
                            else next.add(toggle.id);
                            return next;
                        });
                        setPage(1);
                    }}
                />
            ))}
            </div>

            <span className="expandable-card-list__count">{config.countLabel ? config.countLabel(rows.length) : `${rows.length} résultat(s)`}</span>

            <div className="flex flex-col gap-3">
                {pageRows.length === 0 && <p className="expandable-card-list__empty">{config.noMatchLabel ?? "Aucun résultat ne correspond à ces critères."}</p>}
                {pageRows.map((row) => (
                    <ExpandableCardLib
                        key={config.getRowKey(row)}
                        {...config.toCard(row)}
                        loadItems={() => config.loadItems(row, params)}
                    />
                ))}
            </div>

            <TablePaginationLib
                page={currentPage}
                pageCount={pageCount}
                onPrevAction={() => setPage(Math.max(1, currentPage - 1))}
                onNextAction={() => setPage(Math.min(pageCount, currentPage + 1))}
            />
        </div>
    );
}

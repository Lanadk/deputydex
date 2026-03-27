"use client";

import React, {useMemo} from "react";
import {FilterBarLib} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib";
import {SpanLib} from "@/app/(ui)/component-library/atoms/span/span-lib";
import type {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {GROUPS_FILTER_FIELDS, GROUPS_SORT_OPTIONS} from "@/app/domains/groupes/filters/groupes.filters";

type GroupFilterProps = {
    count: number;
    onQueryChangeAction: (q: FilterBarQuery) => void;
};

export const GroupFilter: React.FC<GroupFilterProps> = ({count, onQueryChangeAction}) => {
    return (
        <div className="flex w-full flex-col overflow-visible rounded-xl border border-main bg-surface-1 shadow-sm">
            <div className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-main">
                        Trier et filtrer les groupes
                    </p>
                    <p className="text-xs text-subtitle-accent">
                        Affinez l’affichage par orientation politique ou ordre de lecture.
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <SpanLib className="text-subtitle-accent">
                        {count} résultat{count > 1 ? "s" : ""}
                    </SpanLib>
                </div>
            </div>

            <div className="px-5 pb-4">
                <FilterBarLib
                    sortOptions={GROUPS_SORT_OPTIONS}
                    filterFields={GROUPS_FILTER_FIELDS}
                    applyMode="auto"
                    onQueryChange={onQueryChangeAction}
                    defaultQuery={useMemo<FilterBarQuery>(
                        () => ({
                            orderBy: [{groupeCountMembers: "desc"}],
                            where: {},
                        }),
                        []
                    )}
                />
            </div>
        </div>
    );
};
"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { FilterBarSectionLib } from "./components/filter-bar-section-lib";
import { FilterFieldsTableLib } from "./components/filter-fields-table-lib";
import { useFilterBar } from "./use-filter-bar-lib.hook";
import { AddFieldDropdownLib } from "./components/add-filter-dropdown";
import {
    ApplyMode,
    FilterBarQuery,
    FilterField,
    SortOption
} from "@/app/_shared/filtering/filter-bar.types";
import { FilterBarActionsLib } from "./components/filter-bar-actions-lib";

export interface FilterBarProps {
    sortOptions?: SortOption[];
    filterFields?: FilterField[];
    onQueryChange: (query: FilterBarQuery) => void;
    applyMode?: ApplyMode;
    showActions?: boolean;
    applyLabel?: string;
    resetLabel?: string;
    defaultQuery?: FilterBarQuery;
    onDraftChange?: (query: FilterBarQuery) => void;
}

export const FilterBarLib: React.FC<FilterBarProps> = (props) => {
    const {
        activeId,
        activeFieldFilters,
        visibleFields,
        visibleFieldDefs,
        sortOptions,
        filterFields,
        handleSortClick,
        handleFieldChange,
        handleAddField,
        handleRemoveField,

        applyMode,
        apply,
        reset,
        hasPendingChanges,
    } = useFilterBar(props);

    const showActions = props.showActions ?? (applyMode === "manual");

    return (
        <div className="filter-bar">
            {sortOptions.length > 0 && (
                <FilterBarSectionLib title="Tri">
                    <div className="fb-sort">
                        {sortOptions.map((option: SortOption) => (
                            <ButtonLib
                                key={option.id}
                                text={option.label}
                                size="small"
                                variant={activeId === option.id ? "primary" : "secondary"}
                                onClick={() => handleSortClick(option.id)}
                                type="button"
                            />
                        ))}
                    </div>
                </FilterBarSectionLib>
            )}

            {filterFields.length > 0 && (
                <FilterBarSectionLib title="Filtres">
                    <FilterFieldsTableLib
                        fields={visibleFieldDefs}
                        activeFieldFilters={activeFieldFilters}
                        onChangeAction={handleFieldChange}
                        onRemoveAction={handleRemoveField}
                    />

                    <AddFieldDropdownLib
                        fields={filterFields}
                        activeFields={visibleFields}
                        onAdd={handleAddField}
                    />

                    {showActions && (
                        <FilterBarActionsLib
                            applyMode={applyMode}
                            hasPendingChanges={hasPendingChanges}
                            onApply={apply}
                            onReset={reset}
                            applyLabel={props.applyLabel}
                            resetLabel={props.resetLabel}
                        />
                    )}
                </FilterBarSectionLib>
            )}
        </div>
    );
};
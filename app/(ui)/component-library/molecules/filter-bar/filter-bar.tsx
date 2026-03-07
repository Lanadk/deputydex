"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { FilterBarSection } from "./components/filter-bar-section";
import { FilterFieldsTable } from "./components/filter-fields-table";
import { useFilterBar } from "./use-filter-bar.hook";
import { AddFieldDropdown } from "./components/add-filter-dropdown";
import {
    ApplyMode,
    FilterBarQuery,
    FilterField,
    SortOption
} from "./filter-bar.types";
import { FilterBarActions } from "./components/filter-bar-actions";

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

export const FilterBar: React.FC<FilterBarProps> = (props) => {
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
                <FilterBarSection title="Tri">
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
                </FilterBarSection>
            )}

            {filterFields.length > 0 && (
                <FilterBarSection title="Filtres">
                    <FilterFieldsTable
                        fields={visibleFieldDefs}
                        activeFieldFilters={activeFieldFilters}
                        onChangeAction={handleFieldChange}
                        onRemoveAction={handleRemoveField}
                    />

                    <AddFieldDropdown
                        fields={filterFields}
                        activeFields={visibleFields}
                        onAdd={handleAddField}
                    />

                    {showActions && (
                        <FilterBarActions
                            applyMode={applyMode}
                            hasPendingChanges={hasPendingChanges}
                            onApply={apply}
                            onReset={reset}
                            applyLabel={props.applyLabel}
                            resetLabel={props.resetLabel}
                        />
                    )}
                </FilterBarSection>
            )}
        </div>
    );
};
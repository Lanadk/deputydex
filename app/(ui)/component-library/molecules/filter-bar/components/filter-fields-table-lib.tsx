"use client";

import React from "react";
import type { ActiveFieldFilter, FilterField } from "@/app/_shared/filtering/filter-bar.types";
import { FilterFieldRowLib } from "./filter-field-row-lib";

export function FilterFieldsTableLib({
                                      fields,
                                      activeFieldFilters,
                                      onChangeAction,
                                      onRemoveAction,
                                  }: {
    fields: FilterField[];
    activeFieldFilters: Record<string, ActiveFieldFilter>;
    onChangeAction: (field: string, next: ActiveFieldFilter) => void;
    onRemoveAction: (field: string) => void;
}) {
    if (fields.length === 0) return null;

    return (
        <div className="fb-fields">
            {fields.map((field) => (
                <FilterFieldRowLib
                    key={field.field}
                    field={field}
                    active={activeFieldFilters[field.field]}
                    onChangeAction={(f, v) => {
                        if (v === null) onRemoveAction(f);
                        else onChangeAction(f, v);
                    }}
                />
            ))}
        </div>
    );
}
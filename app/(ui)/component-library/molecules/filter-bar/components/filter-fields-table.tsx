"use client";

import React from "react";
import type { ActiveFieldFilter, FilterField } from "../filter-bar.types";
import { FilterFieldRow } from "./filter-field-row";

export function FilterFieldsTable({
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
                <FilterFieldRow
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
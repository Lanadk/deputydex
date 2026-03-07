"use client";

import React from "react";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import type { ActiveFieldFilter, FilterField } from "../filter-bar.types";
import { OPERATORS } from "../filter-bar.operators";

export function FilterFieldRow({
                                   field,
                                   active,
                                   onChangeAction,
                               }: {
    field: FilterField;
    active: ActiveFieldFilter | undefined;
    onChangeAction: (field: string, value: ActiveFieldFilter | null) => void;
}) {
    const operators = OPERATORS[field.type];
    const currentOperator = active?.operator ?? operators[0].value;
    const currentValue = active?.value ?? "";

    return (
        <div className="fb-field-row">
            <SpanLib className="fb-field-row__label">{field.label}</SpanLib>

            <div className="fb-field-row__operator">
                <SelectLib
                    value={currentOperator}
                    options={operators.map((op) => ({ value: op.value, label: op.label }))}
                    onChange={(val) => onChangeAction(field.field, { operator: val, value: currentValue })}
                />
            </div>

            <div className="fb-field-row__value">
                {field.type === "enum" ? (
                    <SelectLib
                        value={currentValue}
                        placeholder="— choisir —"
                        options={(field.enumValues ?? []).map((v) => ({ value: v, label: v }))}
                        onChange={(val) => onChangeAction(field.field, val === "" ? null : { operator: currentOperator, value: val })}
                    />
                ) : field.type === "select" ? (
                    <SelectLib
                        value={currentValue}
                        placeholder="— choisir —"
                        options={field.selectOptions ?? []}
                        onChange={(val) => onChangeAction(field.field, val === "" ? null : { operator: currentOperator, value: val })}
                    />
                ) : field.type === "date" ? (
                    <input
                        type="date"
                        className="input-lib fb-date-input"
                        value={currentValue}
                        onChange={(e) => onChangeAction(field.field, e.target.value === "" ? null : { operator: currentOperator, value: e.target.value })}
                    />
                ) : (
                    <InputLib
                        value={currentValue}
                        placeholder="Valeur..."
                        onChange={(val) => onChangeAction(field.field, val === "" ? null : { operator: currentOperator, value: val })}
                    />
                )}
            </div>

            <div className="fb-field-row__remove">
                <SpanLib className="span-lib--clickable" onClick={() => onChangeAction(field.field, null)}>
                    ×
                </SpanLib>
            </div>
        </div>
    );
}
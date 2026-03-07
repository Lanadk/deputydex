"use client";

import React, { useEffect, useRef, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import type { FilterField } from "../filter-bar.types";

export function AddFieldDropdown({
                                     fields,
                                     activeFields,
                                     onAdd,
                                 }: {
    fields: FilterField[];
    activeFields: string[];
    onAdd: (field: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const available = fields.filter((f) => !activeFields.includes(f.field));
    if (available.length === 0) return null;

    return (
        <div className="fb-add" ref={ref}>
            <ButtonLib
                text="+ Ajouter un filtre"
                size="small"
                variant="tertiary"
                onClick={() => setOpen((v) => !v)}
            />

            {open && (
                <div className="fb-add__dropdown">
                    {available.map((f) => (
                        <button
                            key={f.field}
                            type="button"
                            className="fb-add__item"
                            onClick={() => {
                                onAdd(f.field);
                                setOpen(false);
                            }}
                        >
                            <SpanLib>{f.label}</SpanLib>
                            <span className="fb-add__type">{f.type}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
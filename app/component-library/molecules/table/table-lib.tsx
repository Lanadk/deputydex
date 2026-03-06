"use client";

import React from "react";
import { SpanLib } from "@/app/component-library/atoms/span/span-lib";

export type ColumnDef<T> = {
    id: string;
    header: React.ReactNode;
    cell: (row: T) => React.ReactNode;
    align?: "left" | "center" | "right";
    width?: string | number;
};

type TableLibProps<T> = {
    rows: T[];
    columns: ColumnDef<T>[];
    getRowKeyAction: (row: T) => string;

    loading?: boolean;
    emptyLabel?: string;
};

export function TableLib<T>({
                                rows,
                                columns,
                                getRowKeyAction,
                                loading = false,
                                emptyLabel = "Aucun résultat",
                            }: TableLibProps<T>) {
    return (
        <div className="table-lib">
            <div className="table-lib__wrap">
                <table className="table-lib__table">
                    <thead className="table-lib__thead">
                    <tr className="table-lib__tr">
                        {columns.map((c) => (
                            <th
                                key={c.id}
                                className="table-lib__th"
                                style={{
                                    textAlign: c.align ?? "center",
                                    width: c.width,
                                }}
                            >
                                {c.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="table-lib__tbody">
                    {loading ? (
                        <tr className="table-lib__tr">
                            <td className="table-lib__td" colSpan={columns.length}>
                                <SpanLib>Chargement…</SpanLib>
                            </td>
                        </tr>
                    ) : rows.length === 0 ? (
                        <tr className="table-lib__tr">
                            <td className="table-lib__td" colSpan={columns.length}>
                                <SpanLib>{emptyLabel}</SpanLib>
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={getRowKeyAction(row)} className="table-lib__tr">
                                {columns.map((c) => (
                                    <td
                                        key={c.id}
                                        className="table-lib__td"
                                        style={{ textAlign: c.align ?? "center" }}
                                    >
                                        {c.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
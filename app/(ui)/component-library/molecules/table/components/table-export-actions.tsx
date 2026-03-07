"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export type TableExportFormat = "csv" | "json";

type TableActionsProps = {
    title?: string;

    exportEnabled?: boolean;
    exporting?: boolean;

    onExportAction?: (format: TableExportFormat) => void;

    // optionnel: afficher un hint (ex: "Export: tous les résultats filtrés")
    hint?: string;
};

export const TableExportActions: React.FC<TableActionsProps> = ({
                                                              title,
                                                              exportEnabled = true,
                                                              exporting = false,
                                                              onExportAction,
                                                              hint,
                                                          }) => {
    if (!title && !exportEnabled && !hint) return null;

    return (
        <div className="table-actions">
            <div className="table-actions__left">
                {title && <SpanLib className="table-actions__title">{title}</SpanLib>}
                {hint && <SpanLib className="table-actions__hint">{hint}</SpanLib>}
            </div>

            {exportEnabled && onExportAction && (
                <div className="table-actions__right">
                    <ButtonLib
                        text={exporting ? "Export" : "Exporter CSV"}
                        size="small"
                        variant="secondary"
                        type="button"
                        onClick={() => onExportAction("csv")}
                    />
                    <ButtonLib
                        text={exporting ? "Export" : "Exporter JSON"}
                        size="small"
                        variant="tertiary"
                        type="button"
                        onClick={() => onExportAction("json")}
                    />
                </div>
            )}
        </div>
    );
};
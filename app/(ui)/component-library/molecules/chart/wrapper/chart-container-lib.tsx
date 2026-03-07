"use client";

import React from "react";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

interface ChartContainerLibProps {
    title?: string;
    subtitle?: string;
    loading?: boolean;
    empty?: boolean;
    emptyLabel?: string;
    height?: number;
    children: React.ReactNode;
}

export const ChartContainerLib: React.FC<ChartContainerLibProps> = ({
                                                                        title,
                                                                        subtitle,
                                                                        loading = false,
                                                                        empty = false,
                                                                        emptyLabel = "Aucune donnée",
                                                                        height = 320,
                                                                        children,
                                                                    }) => {
    return (
        <div className="chart-lib">
            {(title || subtitle) && (
                <div className="chart-lib__header">
                    {title && <h3 className="chart-lib__title">{title}</h3>}
                    {subtitle && <SpanLib className="chart-lib__subtitle">{subtitle}</SpanLib>}
                </div>
            )}

            <div className="chart-lib__body" style={{ height }}>
                {loading ? (
                    <SpanLib>Chargement ...</SpanLib>
                ) : empty ? (
                    <SpanLib>{emptyLabel}</SpanLib>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};
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
    /**
     * Légende rendue APRÈS `.chart-lib__body`, hors de sa hauteur fixe — voir
     * `ChartLegendLib`. `.chart-lib__body` reste dimensionné pour le dessin
     * (donut/pie/axes) uniquement ; une légende avec beaucoup d'items pousse
     * la hauteur de la carte plutôt que de déborder dessus.
     */
    legend?: React.ReactNode;
}

export const ChartContainerLib: React.FC<ChartContainerLibProps> = ({
                                                                        title,
                                                                        subtitle,
                                                                        loading = false,
                                                                        empty = false,
                                                                        emptyLabel = "Aucune donnée",
                                                                        height = 320,
                                                                        children,
                                                                        legend,
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

            {!loading && !empty && legend}
        </div>
    );
};
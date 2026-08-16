"use client";

import React from "react";

export type ChartLegendItem = {
    label: string;
    color: string;
};

interface ChartLegendLibProps {
    items: ChartLegendItem[];
}

/**
 * Légende HTML (pas SVG) pour les charts polaires (Donut/Pie) — remplace la
 * légende intégrée de `@mui/x-charts`, qui réserve une hauteur/largeur fixe
 * indépendante du nombre d'items : avec beaucoup de labels (ex: catégories
 * socio-professionnelles, ~25 items), le SVG et sa légende débordaient de
 * `.chart-lib__body` au lieu de s'adapter. Ici, du flexbox HTML classique
 * (`flex-wrap`) qui pousse la hauteur de la carte plutôt que de déborder —
 * voir `.chart-legend-lib` dans globals.css.
 */
export const ChartLegendLib: React.FC<ChartLegendLibProps> = ({ items }) => {
    if (items.length === 0) return null;

    return (
        <div className="chart-legend-lib">
            {items.map((item, i) => (
                <div className="chart-legend-lib__item" key={`${item.label}-${i}`}>
                    <span className="chart-legend-lib__swatch" style={{ backgroundColor: item.color }} />
                    <span className="chart-legend-lib__label">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

/**
 * Résout la couleur de chaque item comme le ferait `@mui/x-charts` en
 * interne, pour que la légende custom reste alignée avec les couleurs
 * réellement dessinées dans le donut/pie — "parliament-group" porte déjà sa
 * couleur par item (`mapSeriesToGroupColors`), "default" cycle sur la
 * palette dans l'ordre des items, exactement comme `colors={defaultChartColors}`
 * passé au chart MUI.
 */
export function buildLegendItems<T extends { label: string; color?: string }>(
    items: T[],
    defaultColors: readonly string[]
): ChartLegendItem[] {
    return items.map((item, i) => ({
        label: item.label,
        color: item.color ?? defaultColors[i % defaultColors.length],
    }));
}

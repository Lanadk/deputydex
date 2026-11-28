"use client";

import React from "react";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { ChartDisplayType } from "@/app/(ui)/_shared/statistics/comparator/comparator.types";
import { BarChartLib } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { PieChartLib } from "@/app/(ui)/component-library/molecules/chart/pie-chart/pie-chart-lib";
import { DonutChartLib } from "@/app/(ui)/component-library/molecules/chart/pie-chart/donut-chart-lib";
import { LineChartLib } from "@/app/(ui)/component-library/molecules/chart/line-chart/line-chart-lib";
import { DashedLineChartLib } from "@/app/(ui)/component-library/molecules/chart/line-chart/dashed-line-chart-lib";
import { ScatterChartLib } from "@/app/(ui)/component-library/molecules/chart/point-chart/scatter-chart-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { ChartColorVariant } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { toMultiSeriesDataset } from "@/app/(ui)/_shared/statistics/data/multi-series-dataset";

interface RenderStatChartProps {
    data: RawStatData | null;
    displayType: ChartDisplayType | null;
    loading: boolean;
    title?: string;
    /** "parliament-group" colore le chart avec la couleur du groupe politique — voir StatDefinition.chartVariant */
    variant?: ChartColorVariant;
    /**
     * Code/libellé du groupe sélectionné — n'a d'effet qu'en scope "entity"
     * + variant "parliament-group" + un chart à une seule série (ex:
     * groupes.cohesion) : ces charts n'ont pas de label par item à faire
     * correspondre à un groupe (contrairement à une distribution comme
     * groupes.effectifs), juste UNE courbe/série à colorer.
     */
    groupLabel?: string | null;
}

/**
 * Adapte RawStatData (forme neutre, découplée du format) vers le composant
 * chart concret pour le displayType choisi — le pendant de
 * BlockChartRenderer (block-section/_renderers/) pour le catalogue de stats,
 * qui lui adapte ChartDataWrapper (forme figée par displayType, un seul
 * format possible par block de page).
 */
export const RenderStatChart: React.FC<RenderStatChartProps> = ({ data, displayType, loading, title, variant, groupLabel }) => {
    if (!data) {
        return <BarChartLib title={title} loading={loading} data={[]} />;
    }

    if (data.shape === "scalar") {
        return <KpiCardLib kpiValue={data.value} kpiLabel={data.label ?? title ?? ""} />;
    }

    if (!displayType) return null;

    switch (data.shape) {
        case "distribution": {
            // Un item par label ici (ex: un groupe par item pour
            // groupes.effectifs) — chaque item peut être coloré individuellement.
            if (displayType === "donut") {
                return <DonutChartLib title={title} loading={loading} data={data.items.map((i) => ({ ...i, id: i.label }))} variant={variant} />;
            }
            if (displayType === "pie") {
                return <PieChartLib title={title} loading={loading} data={data.items} variant={variant} />;
            }
            return <BarChartLib title={title} loading={loading} data={data.items} variant={variant} />;
        }

        case "timeseries": {
            // Une seule série (l'entité sélectionnée, ex: groupes.cohesion) —
            // `groupLabel` colore toute la courbe, pas item par item.
            if (displayType === "line-dashed") {
                return <DashedLineChartLib title={title} loading={loading} data={data.points} variant={variant} groupLabel={groupLabel} />;
            }
            if (displayType === "line") {
                // `markers` : repères posés par le serveur (ex: début de chaque législature sur une courbe « toutes »).
                return <LineChartLib title={title} loading={loading} data={data.points} variant={variant} groupLabel={groupLabel} markers={data.markers} />;
            }
            // Fallback bar : les labels sont des mois, pas des groupes — pas
            // de variant ici, `BarChartLib` chercherait un groupe par mois.
            return <BarChartLib title={title} loading={loading} data={data.points} />;
        }

        case "multi-series": {
            const stacked = displayType === "stacked-bar";
            const dataset = toMultiSeriesDataset(data.series, stacked);

            if (displayType === "line-multi") {
                return <LineChartLib title={title} loading={loading} data={dataset.data} series={dataset.series} variant={variant} markers={data.markers} />;
            }
            if (displayType === "line-dashed-multi") {
                return <DashedLineChartLib title={title} loading={loading} data={dataset.data} series={dataset.series} variant={variant} />;
            }
            return <BarChartLib title={title} loading={loading} data={dataset.data} series={dataset.series} variant={variant} />;
        }

        case "points": {
            return (
                <ScatterChartLib
                    title={title}
                    loading={loading}
                    series={[
                        {
                            id: "series",
                            label: title ?? "",
                            data: data.points.map((point, i) => ({ id: point.label ?? i, x: point.x, y: point.y })),
                        },
                    ]}
                />
            );
        }

        default:
            return null;
    }
};

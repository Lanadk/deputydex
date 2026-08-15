"use client";

import React from "react";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { ChartDisplayType } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.types";
import { BarChartLib } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { PieChartLib } from "@/app/(ui)/component-library/molecules/chart/pie-chart/pie-chart-lib";
import { DonutChartLib } from "@/app/(ui)/component-library/molecules/chart/pie-chart/donut-chart-lib";
import { LineChartLib } from "@/app/(ui)/component-library/molecules/chart/line-chart/line-chart-lib";
import { DashedLineChartLib } from "@/app/(ui)/component-library/molecules/chart/line-chart/dashed-line-chart-lib";
import { ScatterChartLib } from "@/app/(ui)/component-library/molecules/chart/point-chart/scatter-chart-lib";
import { KpiCardLib } from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import { MultiDatum, SeriesConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";

/**
 * Pivote une liste de séries "longues" (une entrée par série, chacune avec
 * ses propres {label, value}) vers le format "large" attendu par
 * BarChartLib/LineChartLib en mode multi-séries (une ligne par label, une
 * colonne par série). `stacked` ajoute un `stack` commun à toutes les
 * séries — c'est ce qui fait un bar-multi empilé plutôt que groupé, sans
 * dépendre du StackedBarChartLib (celui-ci est figé sur pour/contre/abstention,
 * non réutilisable pour une donnée de catalogue générique).
 */
function toMultiSeriesDataset(
    series: { name: string; items: { label: string; value: number }[] }[],
    stacked: boolean
): { data: MultiDatum[]; series: SeriesConfig[] } {
    const labels = Array.from(new Set(series.flatMap((s) => s.items.map((item) => item.label))));

    const seriesConfig: SeriesConfig[] = series.map((s, i) => ({
        dataKey: `s${i}`,
        label: s.name,
        ...(stacked ? { stack: "stack" } : {}),
    }));

    const data: MultiDatum[] = labels.map((label) => {
        const row: MultiDatum = { label };
        series.forEach((s, i) => {
            row[`s${i}`] = s.items.find((item) => item.label === label)?.value ?? null;
        });
        return row;
    });

    return { data, series: seriesConfig };
}

interface RenderStatChartProps {
    data: RawStatData | null;
    displayType: ChartDisplayType | null;
    loading: boolean;
    title?: string;
}

/**
 * Adapte RawStatData (forme neutre, découplée du format) vers le composant
 * chart concret pour le displayType choisi — le pendant de
 * BlockChartRenderer (block-section/_renderers/) pour le catalogue de stats,
 * qui lui adapte ChartDataWrapper (forme figée par displayType, un seul
 * format possible par block de page).
 */
export const RenderStatChart: React.FC<RenderStatChartProps> = ({ data, displayType, loading, title }) => {
    if (!data) {
        return <BarChartLib title={title} loading={loading} data={[]} />;
    }

    if (data.shape === "scalar") {
        return <KpiCardLib kpiValue={data.value} kpiLabel={data.label ?? title ?? ""} />;
    }

    if (!displayType) return null;

    switch (data.shape) {
        case "distribution": {
            if (displayType === "donut") {
                return <DonutChartLib title={title} loading={loading} data={data.items.map((i) => ({ ...i, id: i.label }))} />;
            }
            if (displayType === "pie") {
                return <PieChartLib title={title} loading={loading} data={data.items} />;
            }
            return <BarChartLib title={title} loading={loading} data={data.items} />;
        }

        case "timeseries": {
            if (displayType === "line-dashed") {
                return <DashedLineChartLib title={title} loading={loading} data={data.points} />;
            }
            if (displayType === "line") {
                return <LineChartLib title={title} loading={loading} data={data.points} />;
            }
            return <BarChartLib title={title} loading={loading} data={data.points} />;
        }

        case "multi-series": {
            const stacked = displayType === "stacked-bar";
            const dataset = toMultiSeriesDataset(data.series, stacked);

            if (displayType === "line-multi") {
                return <LineChartLib title={title} loading={loading} data={dataset.data} series={dataset.series} />;
            }
            if (displayType === "line-dashed-multi") {
                return <DashedLineChartLib title={title} loading={loading} data={dataset.data} series={dataset.series} />;
            }
            return <BarChartLib title={title} loading={loading} data={dataset.data} series={dataset.series} />;
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

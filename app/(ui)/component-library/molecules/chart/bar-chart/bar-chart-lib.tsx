"use client";

import React from "react";
import {BarChart} from "@mui/x-charts/BarChart";
import {ChartContainerLib} from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import {
    type ChartColorVariant,
    getGroupChartColor,
    isParliamentGroupVariant,
    mapSeriesToGroupColors,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {
    axisTextColor,
    cartesianChartSx,
} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/component-library/molecules/chart/chart-theme";

export type BarChartDatum = {
    label: string;
    value: number;
};

export type BarChartDatasetRow = {
    label: string;
    [key: string]: string | number | null | undefined;
};

export type BarChartSeriesConfig = {
    dataKey: string;
    label: string;
    stack?: string;
};

interface BarChartLibProps {
    data: BarChartDatum[] | BarChartDatasetRow[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    emptyLabel?: string;
    variant?: ChartColorVariant;
    series?: BarChartSeriesConfig[];
}

export const BarChartLib: React.FC<BarChartLibProps> = ({
                                                            data,
                                                            title,
                                                            subtitle,
                                                            loading = false,
                                                            height = 320,
                                                            emptyLabel = "Aucune donnée",
                                                            variant = "default",
                                                            series,
                                                        }) => {
    const empty = data.length === 0;
    const isMultiSeries = Array.isArray(series) && series.length > 0;

    const shouldHideLegend =
        !isMultiSeries && variant === "parliament-group";

    const xAxis =
        !isMultiSeries && isParliamentGroupVariant(variant)
            ? [
                {
                    scaleType: "band" as const,
                    dataKey: "label",
                    tickLabelStyle: {
                        fill: axisTextColor,
                        color: axisTextColor,
                        fontSize: 12,
                    },
                    labelStyle: {
                        fill: axisTextColor,
                        color: axisTextColor,
                    },
                    colorMap: {
                        type: "ordinal" as const,
                        values: data.map((item) => String(item.label)),
                        colors: data.map((item) => getGroupChartColor(String(item.label))),
                        unknownColor: "var(--chart-1)",
                    },
                },
            ]
            : [
                {
                    scaleType: "band" as const,
                    dataKey: "label",
                    tickLabelStyle: {
                        fill: axisTextColor,
                        color: axisTextColor,
                        fontSize: 12,
                    },
                    labelStyle: {
                        fill: axisTextColor,
                        color: axisTextColor,
                    },
                },
            ];

    const yAxis = [
        {
            tickLabelStyle: {
                fill: axisTextColor,
                color: axisTextColor,
                fontSize: 12,
            },
            labelStyle: {
                fill: axisTextColor,
                color: axisTextColor,
            },
        },
    ];

    const resolvedSeries = isMultiSeries
        ? isParliamentGroupVariant(variant)
            ? mapSeriesToGroupColors(series.map((item) => ({...item})))
            : series
        : [
            {
                dataKey: "value",
                label: title ?? "Valeur",
            },
        ];

    return (
        <ChartContainerLib
            title={title}
            subtitle={subtitle}
            loading={loading}
            empty={empty}
            emptyLabel={emptyLabel}
            height={height}
        >
            <BarChart
                height={height}
                dataset={data}
                colors={isParliamentGroupVariant(variant) ? undefined : defaultChartColors}
                xAxis={xAxis}
                yAxis={yAxis}
                hideLegend={shouldHideLegend}
                series={resolvedSeries}
                sx={cartesianChartSx}
            />
        </ChartContainerLib>
    );
};
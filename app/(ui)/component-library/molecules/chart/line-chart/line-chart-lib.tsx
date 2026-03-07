"use client";

import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { ChartContainerLib } from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import {
    type ChartColorVariant,
    getSingleSeriesGroupColor,
    isParliamentGroupVariant,
    mapSeriesToGroupColors,
} from "@/app/lib/colors/parliament-groups/group-theme.helpers";
import {
    axisTextColor,
    cartesianChartSx,
} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/component-library/molecules/chart/chart-theme";

export type LineChartDatum = {
    label: string;
    value: number;
};

export type LineChartDatasetRow = {
    label: string;
    [key: string]: string | number | null | undefined;
};

export type LineChartSeriesConfig = {
    dataKey: string;
    label: string;
};

export type ColoredLineChartSeriesConfig = LineChartSeriesConfig & {
    color?: string;
};

type LineChartLibProps = {
    data: LineChartDatum[] | LineChartDatasetRow[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    emptyLabel?: string;
    variant?: ChartColorVariant;
    groupLabel?: string | null;
    series?: LineChartSeriesConfig[];
};

export const LineChartLib: React.FC<LineChartLibProps> = ({
                                                              data,
                                                              title,
                                                              subtitle,
                                                              loading = false,
                                                              height = 320,
                                                              emptyLabel = "Aucune donnée",
                                                              variant = "default",
                                                              groupLabel,
                                                              series,
                                                          }) => {
    const empty = data.length === 0;
    const isMultiSeries = Array.isArray(series) && series.length > 0;

    const singleSeriesColor = getSingleSeriesGroupColor(variant, groupLabel);

    const multiSeries: ColoredLineChartSeriesConfig[] = isMultiSeries
        ? isParliamentGroupVariant(variant)
            ? mapSeriesToGroupColors(series)
            : series
        : [];

    const singleSeries = !isMultiSeries
        ? [
            {
                data: (data as LineChartDatum[]).map((d) => d.value),
                label: title ?? "Valeur",
                ...(singleSeriesColor ? { color: singleSeriesColor } : {}),
            },
        ]
        : [];

    return (
        <ChartContainerLib
            title={title}
            subtitle={subtitle}
            loading={loading}
            empty={empty}
            emptyLabel={emptyLabel}
            height={height}
        >
            <LineChart
                height={height}
                dataset={isMultiSeries ? (data as LineChartDatasetRow[]) : undefined}
                colors={isParliamentGroupVariant(variant) ? undefined : defaultChartColors}
                xAxis={[
                    {
                        scaleType: "point",
                        data: data.map((d) => d.label),
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
                ]}
                yAxis={[
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
                ]}
                series={
                    isMultiSeries
                        ? multiSeries.map((item) => ({
                            dataKey: item.dataKey,
                            label: item.label,
                            ...(item.color ? { color: item.color } : {}),
                        }))
                        : singleSeries
                }
                sx={cartesianChartSx}
            />
        </ChartContainerLib>
    );
};
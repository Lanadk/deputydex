"use client";

import React from "react";
import { ChartContainerLib } from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import { BarChart } from "@mui/x-charts/BarChart";
import {
    axisTextColor,
    cartesianChartSx,
} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/theme/charts/chart-default-theme";

export type StackedBarDatum = {
    label: string;
    pour: number;
    contre: number;
    abstention: number;
};

type StackedBarChartLibProps = {
    data: StackedBarDatum[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    emptyLabel?: string;
};

export const StackedBarChartLib: React.FC<StackedBarChartLibProps> = ({
                                                                          data,
                                                                          title,
                                                                          subtitle,
                                                                          loading = false,
                                                                          height = 320,
                                                                          emptyLabel = "Aucune donnée",
                                                                      }) => {
    const empty = data.length === 0;

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
                dataset={data}
                colors={defaultChartColors}
                height={height}
                xAxis={[
                    {
                        scaleType: "band",
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
                series={[
                    { dataKey: "pour", label: "Pour", stack: "votes" },
                    { dataKey: "contre", label: "Contre", stack: "votes" },
                    { dataKey: "abstention", label: "Abstention", stack: "votes" },
                ]}
                sx={cartesianChartSx}
            />
        </ChartContainerLib>
    );
};
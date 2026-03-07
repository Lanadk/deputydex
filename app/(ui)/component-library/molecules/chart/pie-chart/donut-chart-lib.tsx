"use client";

import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { ChartContainerLib } from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import {
    isParliamentGroupVariant,
    mapSeriesToGroupColors,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {polarChartSx} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/component-library/molecules/chart/chart-theme";

export type DonutChartDatum = {
    id: string | number;
    label: string;
    value: number;
};

type DonutChartLibProps = {
    data: DonutChartDatum[];
    title?: string;
    subtitle?: string;
    height?: number;
    loading?: boolean;
    emptyLabel?: string;
    showLegend?: boolean;
    innerRadius?: number;
    outerRadius?: number;
    variant?: "default" | "parliament-group";
};

export const DonutChartLib: React.FC<DonutChartLibProps> = ({
                                                                data,
                                                                title,
                                                                subtitle,
                                                                height = 320,
                                                                loading = false,
                                                                emptyLabel = "Aucune donnée",
                                                                showLegend = true,
                                                                innerRadius = 60,
                                                                outerRadius = 100,
                                                                variant = "default",
                                                            }) => {
    const empty = data.length === 0;

    const seriesWithColors = isParliamentGroupVariant(variant)
        ? mapSeriesToGroupColors(data)
        : data;

    return (
        <ChartContainerLib
            title={title}
            subtitle={subtitle}
            loading={loading}
            empty={empty}
            emptyLabel={emptyLabel}
            height={height}
        >
            <PieChart
                height={height}
                colors={variant === "default" ? defaultChartColors : undefined}
                series={[
                    {
                        data: seriesWithColors,
                        innerRadius,
                        outerRadius,
                        paddingAngle: 2,
                        cornerRadius: 4,
                    },
                ]}
                hideLegend={!showLegend}
                sx={polarChartSx}
            />
        </ChartContainerLib>
    );
};
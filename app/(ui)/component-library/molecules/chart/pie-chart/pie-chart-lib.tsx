"use client";

import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { ChartContainerLib } from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import {
    isParliamentGroupVariant,
    mapSeriesToGroupColors,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {polarChartSx} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/theme/charts/chart-default-theme";

export type PieChartDatum = {
    label: string;
    value: number;
};

interface PieChartLibProps {
    data: PieChartDatum[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    emptyLabel?: string;
    variant?: "default" | "parliament-group";
}

export const PieChartLib: React.FC<PieChartLibProps> = ({
                                                            data,
                                                            title,
                                                            subtitle,
                                                            loading = false,
                                                            height = 320,
                                                            emptyLabel = "Aucune donnée",
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
                    },
                ]}
                sx={polarChartSx}
            />
        </ChartContainerLib>
    );
};
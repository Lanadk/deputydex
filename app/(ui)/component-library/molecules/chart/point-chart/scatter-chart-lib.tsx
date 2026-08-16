"use client";

import React from "react";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { ChartContainerLib } from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import {
    isParliamentGroupVariant,
    mapSeriesToGroupColors,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {
    axisTextColor,
    cartesianChartSx,
} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/theme/charts/chart-default-theme";

export type ScatterPoint = {
    id: string | number;
    x: number;
    y: number;
    z?: number;
};

export type ScatterSeriesLib = {
    id: string;
    label: string;
    data: ScatterPoint[];
};

type ScatterChartLibProps = {
    series: ScatterSeriesLib[];
    title?: string;
    subtitle?: string;
    xLabel?: string;
    yLabel?: string;
    height?: number;
    loading?: boolean;
    emptyLabel?: string;
    showLegend?: boolean;
    variant?: "default" | "parliament-group";
};

export const ScatterChartLib: React.FC<ScatterChartLibProps> = ({
                                                                    series,
                                                                    title,
                                                                    subtitle,
                                                                    xLabel,
                                                                    yLabel,
                                                                    height = 360,
                                                                    loading = false,
                                                                    emptyLabel = "Aucune donnée",
                                                                    showLegend = true,
                                                                    variant = "default",
                                                                }) => {
    const empty = series.length === 0 || series.every((s) => s.data.length === 0);

    const seriesWithColors = isParliamentGroupVariant(variant)
        ? mapSeriesToGroupColors(series)
        : series;

    return (
        <ChartContainerLib
            title={title}
            subtitle={subtitle}
            loading={loading}
            empty={empty}
            emptyLabel={emptyLabel}
            height={height}
        >
            <ScatterChart
                height={height}
                colors={variant === "default" ? defaultChartColors : undefined}
                xAxis={[
                    {
                        label: xLabel,
                        // MUI ajoute 20px à la hauteur par défaut (25px) quand
                        // un `label` est fourni, soit 45px pour DEUX lignes de
                        // texte (ticks + libellé d'unité) — trop juste combiné
                        // au conteneur à overflow: hidden, le libellé d'unité
                        // (ex: "Amendements déposés") se faisait couper.
                        height: xLabel ? 56 : 36,
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
                        label: yLabel,
                        // Même logique que xAxis, en largeur : 45px/65px par
                        // défaut (label ou non) pour loger ticks + libellé
                        // d'unité pivoté verticalement.
                        width: yLabel ? 80 : 55,
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
                series={seriesWithColors}
                hideLegend={!showLegend}
                sx={cartesianChartSx}
            />
        </ChartContainerLib>
    );
};
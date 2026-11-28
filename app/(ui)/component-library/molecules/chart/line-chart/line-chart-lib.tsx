"use client";

import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { ChartContainerLib } from "@/app/(ui)/component-library/molecules/chart/wrapper/chart-container-lib";
import {
    type ChartColorVariant,
    getSingleSeriesGroupColor,
    isParliamentGroupVariant,
    mapSeriesToGroupColors,
} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {
    axisTextColor,
    cartesianChartSx,
} from "@/app/(ui)/theme/charts/chart.config";
import {defaultChartColors} from "@/app/(ui)/theme/charts/chart-default-theme";

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
    /**
     * Repères verticaux : `at` = un libellé de l'axe des x (ex: « 2024-07 »),
     * `label` = texte du repère (ex: « Début de la 17ᵉ législature »). Un
     * repère dont `at` n'est pas sur l'axe est ignoré.
     */
    markers?: { at: string; label: string }[];
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
                                                              markers = [],
                                                          }) => {
    const empty = data.length === 0;
    const libellesAxe = new Set(data.map((d) => d.label));
    const reperes = markers.filter((m) => libellesAxe.has(m.at));
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
                        // En multi-séries, `dataKey` (pas `data`) — avec un
                        // `dataset` fourni, MUI a besoin de piocher les
                        // valeurs d'axe dans ce même dataset ; un tableau
                        // `data` calculé à part n'est pas relié aux lignes du
                        // dataset et produit un chart vide (voir BarChartLib,
                        // qui utilise déjà `dataKey` pour son mode dataset).
                        ...(isMultiSeries ? { dataKey: "label" } : { data: data.map((d) => d.label) }),
                        // Voir BarChartLib : hauteur de ticks par défaut fixe
                        // (25px, ne s'adapte pas au texte) + conteneur à
                        // overflow: hidden = texte coupé sans marge de sécurité.
                        height: 36,
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
            >
                {reperes.map((m) => (
                    <ChartsReferenceLine
                        key={`${m.at}-${m.label}`}
                        x={m.at}
                        label={m.label}
                        labelAlign="start"
                        lineStyle={{ stroke: axisTextColor, strokeDasharray: "4 4" }}
                        labelStyle={{ fill: axisTextColor, fontSize: 11 }}
                    />
                ))}
            </LineChart>
        </ChartContainerLib>
    );
};
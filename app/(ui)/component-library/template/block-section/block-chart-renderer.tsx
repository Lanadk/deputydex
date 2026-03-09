"use client";

import { useEffect, useState } from "react";
import { ChartDataWrapper, ChartConfig } from "./chart-config.types";
import { BarChartLib } from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import { LineChartLib } from "@/app/(ui)/component-library/molecules/chart/line-chart/line-chart-lib";
import { DashedLineChartLib } from "@/app/(ui)/component-library/molecules/chart/line-chart/dashed-line-chart-lib";
import { PieChartLib } from "@/app/(ui)/component-library/molecules/chart/pie-chart/pie-chart-lib";
import { DonutChartLib } from "@/app/(ui)/component-library/molecules/chart/pie-chart/donut-chart-lib";
import { StackedBarChartLib } from "@/app/(ui)/component-library/molecules/chart/bar-chart/stacked-bar-chart-lib";
import { ScatterChartLib } from "@/app/(ui)/component-library/molecules/chart/point-chart/scatter-chart-lib";

type BlockChartRenderer = {
    config: ChartConfig;
    legislature: number;
};

export function BlockChartRenderer({ config, legislature }: BlockChartRenderer) {
    const [chart, setChart] = useState<ChartDataWrapper | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        config.gatewayFn(legislature)
            .then(setChart)
            .finally(() => setLoading(false));
    }, [legislature, config.id]);

    const base = { title: config.title, subtitle: config.subtitle, loading };

    if (!chart && !loading) return null;

    if (!chart) {
        return <BarChartLib {...base} data={[]} />;
    }

    switch (chart.type) {
        case 'bar':
            return <BarChartLib {...base} data={chart.data} variant={chart.variant} />;
        case 'bar-multi':
            return <BarChartLib {...base} data={chart.data} series={chart.series} variant={chart.variant} />;
        case 'stacked-bar':
            return <StackedBarChartLib {...base} data={chart.data as never} />;
        case 'line':
            return <LineChartLib {...base} data={chart.data} variant={chart.variant} groupLabel={chart.groupLabel} />;
        case 'line-multi':
            return <LineChartLib {...base} data={chart.data} series={chart.series} variant={chart.variant} />;
        case 'line-dashed':
            return <DashedLineChartLib {...base} data={chart.data} variant={chart.variant} groupLabel={chart.groupLabel} />;
        case 'line-dashed-multi':
            return <DashedLineChartLib {...base} data={chart.data} series={chart.series} variant={chart.variant} />;
        case 'pie':
            return <PieChartLib {...base} data={chart.data} variant={chart.variant} />;
        case 'donut':
            return <DonutChartLib {...base} data={chart.data.map(d => ({ ...d, id: d.label }))} variant={chart.variant} />;
        case 'scatter':
            return <ScatterChartLib {...base} series={chart.series} xLabel={chart.xLabel} yLabel={chart.yLabel} variant={chart.variant} />;
    }
}
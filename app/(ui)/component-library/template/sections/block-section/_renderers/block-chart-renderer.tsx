"use client";

import {
    ChartDataWrapper,
    ChartConfig,
    SimpleDatum,
    MultiDatum,
    SeriesConfig,
    ScatterSeries
} from "../chart-config.types";
import {BarChartLib} from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import {LineChartLib} from "@/app/(ui)/component-library/molecules/chart/line-chart/line-chart-lib";
import {DashedLineChartLib} from "@/app/(ui)/component-library/molecules/chart/line-chart/dashed-line-chart-lib";
import {PieChartLib} from "@/app/(ui)/component-library/molecules/chart/pie-chart/pie-chart-lib";
import {DonutChartLib} from "@/app/(ui)/component-library/molecules/chart/pie-chart/donut-chart-lib";
import {StackedBarChartLib} from "@/app/(ui)/component-library/molecules/chart/bar-chart/stacked-bar-chart-lib";
import {ScatterChartLib} from "@/app/(ui)/component-library/molecules/chart/point-chart/scatter-chart-lib";

type BlockChartRendererProps = {
    config: ChartConfig;
    data: ChartDataWrapper | null;
    loading: boolean;
};

export function BlockChartRenderer({config, data, loading}: BlockChartRendererProps) {
    const base = {title: config.title, subtitle: config.subtitle, loading};

    if (!data && !loading) return null;
    if (!data) return <BarChartLib {...base} data={[]}/>;

    switch (config.displayType) {
        case 'bar':
        case 'pie':
        case 'donut': {
            const d = data as { data: SimpleDatum[] };
            if (config.displayType === 'donut')
                return <DonutChartLib {...base} data={d.data.map(x => ({...x, id: x.label}))}
                                      variant={config.variant}/>;
            if (config.displayType === 'pie')
                return <PieChartLib {...base} data={d.data} variant={config.variant}/>;
            return <BarChartLib {...base} data={d.data} variant={config.variant}/>;
        }
        case 'bar-multi':
        case 'stacked-bar':
        case 'line-multi':
        case 'line-dashed-multi': {
            const d = data as { data: MultiDatum[]; series: SeriesConfig[] };
            if (config.displayType === 'stacked-bar')
                return <StackedBarChartLib {...base} data={d.data as never}/>;
            if (config.displayType === 'line-multi')
                return <LineChartLib {...base} data={d.data} series={d.series} variant={config.variant}/>;
            if (config.displayType === 'line-dashed-multi')
                return <DashedLineChartLib {...base} data={d.data} series={d.series} variant={config.variant}/>;
            return <BarChartLib {...base} data={d.data} series={d.series} variant={config.variant}/>;
        }
        case 'line':
        case 'line-dashed': {
            const d = data as { data: SimpleDatum[]; groupLabel?: string };
            if (config.displayType === 'line-dashed')
                return <DashedLineChartLib {...base} data={d.data} variant={config.variant} groupLabel={d.groupLabel}/>;
            return <LineChartLib {...base} data={d.data} variant={config.variant} groupLabel={d.groupLabel}/>;
        }
        case 'scatter': {
            const d = data as { series: ScatterSeries[]; xLabel?: string; yLabel?: string };
            return <ScatterChartLib {...base} series={d.series} xLabel={d.xLabel} yLabel={d.yLabel}/>;
        }
    }
}
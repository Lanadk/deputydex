import {ChartColorVariant} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {ScatterPoint} from "@/app/(ui)/component-library/molecules/chart/point-chart/scatter-chart-lib";

export type SimpleDatum = { label: string; value: number };
export type MultiDatum = { label: string; [key: string]: string | number | null | undefined };
export type SeriesConfig = { dataKey: string; label: string; stack?: string };
export type ScatterSeries = { id: string; label: string; data: ScatterPoint[] };

export type ChartDataWrapper =
    | { data: SimpleDatum[] }
    | { data: MultiDatum[]; series: SeriesConfig[] }
    | { data: SimpleDatum[]; groupLabel?: string }
    | { series: ScatterSeries[]; xLabel?: string; yLabel?: string }

type ChartConfigBase = {
    id: string;
    title: string;
    subtitle?: string;
    theme: string;
};

export type ChartConfig =
    | ChartConfigBase & { displayType: 'bar' | 'pie' | 'donut'; variant?: ChartColorVariant }
    | ChartConfigBase & {
    displayType: 'bar-multi' | 'stacked-bar' | 'line-multi' | 'line-dashed-multi';
    variant?: ChartColorVariant
}
    | ChartConfigBase & { displayType: 'line' | 'line-dashed'; variant?: ChartColorVariant }
    | ChartConfigBase & { displayType: 'scatter' }
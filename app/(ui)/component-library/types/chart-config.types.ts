import { ChartColorVariant } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { ScatterPoint } from "@/app/(ui)/component-library/molecules/chart/point-chart/scatter-chart-lib";

//Données injecté dans les charts
export type SimpleDatum = { label: string; value: number };
export type MultiDatum  = { label: string; [key: string]: string | number | null | undefined };
export type SeriesConfig = { dataKey: string; label: string; stack?: string };
export type ScatterSeries = { id: string; label: string; data: ScatterPoint[] };

// Union discriminée par type de chart
export type ChartDataWrapper =
    | { type: 'bar';               data: SimpleDatum[];  variant?: ChartColorVariant }
    | { type: 'bar-multi';         data: MultiDatum[];   series: SeriesConfig[]; variant?: ChartColorVariant }
    | { type: 'stacked-bar';       data: MultiDatum[];   series: SeriesConfig[] }
    | { type: 'line';              data: SimpleDatum[];  variant?: ChartColorVariant; groupLabel?: string }
    | { type: 'line-multi';        data: MultiDatum[];   series: SeriesConfig[]; variant?: ChartColorVariant }
    | { type: 'line-dashed';       data: SimpleDatum[];  variant?: ChartColorVariant; groupLabel?: string }
    | { type: 'line-dashed-multi'; data: MultiDatum[];   series: SeriesConfig[]; variant?: ChartColorVariant }
    | { type: 'pie';               data: SimpleDatum[];  variant?: ChartColorVariant }
    | { type: 'donut';             data: SimpleDatum[];  variant?: ChartColorVariant }
    | { type: 'scatter';           series: ScatterSeries[]; xLabel?: string; yLabel?: string; variant?: ChartColorVariant }

//Config d'un chart dans le registre
export type ChartConfig = {
    id: string;
    title: string;
    subtitle?: string;
    theme: string;
    gatewayFn: (legislature: number) => Promise<ChartDataWrapper>;
};
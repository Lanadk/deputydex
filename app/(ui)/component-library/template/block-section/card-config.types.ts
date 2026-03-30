import {ChartColorVariant} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

export type SimpleCardDatum = { label: string; value: string | number };

export type CardDataWrapper =
    | { type: 'kpi-card'; data: SimpleCardDatum; variant?: ChartColorVariant }

export type CardConfig = {
    id: string;
    title?: string;
    subtitle?: string;
    theme?: string;
    gatewayFn: (legislature: number) => Promise<CardDataWrapper>;
}
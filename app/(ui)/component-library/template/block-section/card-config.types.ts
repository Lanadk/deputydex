import {ChartColorVariant} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {CustomProps, VariantProps} from "@/app/(ui)/component-library/atoms/badge/badge-lib";

export type KpiCardData = {
    value: string | number;
    label: string;
};

export type KpiBarCardData = {
    title?: string;
    items: KpiBarCardItem[];
    maxValue?: number;
    footer?: string;
    showFooterDivider?: boolean;
};

export type KpiBarCardItem = {
    label: string;
    value: number;
    displayValue?: string;
    color?: string;
};

export type SummaryListItem =
    | { label: string; badge: VariantProps }
    | { label: string; badge: CustomProps }
    | { label: string; value: string | number };

export type SummaryListCardData = {
    title?: string;
    items: SummaryListItem[];
};

export type CardDataWrapper =
    | { data: KpiCardData }
    | { data: KpiBarCardData }
    | { data: SummaryListCardData };

type CardConfigBase = {
    id: string;
    variant?: ChartColorVariant;
    title?: string;
    subtitle?: string;
    theme?: string;
};

export type CardConfig =
    | CardConfigBase & { displayType: 'kpi-card' }
    | CardConfigBase & { displayType: 'kpi-bar-card' }
    | CardConfigBase & { displayType: 'summary-list-card' };
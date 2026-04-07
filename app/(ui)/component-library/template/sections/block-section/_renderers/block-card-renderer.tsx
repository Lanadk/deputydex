import {
    CardConfig,
    CardDataWrapper, KpiBarCardData,
    KpiCardData, SummaryListCardData
} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import {KpiCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import {KpiBarCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-bar-card/kpi-bar-card-lib";
import {SummaryListCardLib} from "@/app/(ui)/component-library/molecules/cards/summary-list-card/summary-list-card";

type BlockCardRendererProps = {
    config: CardConfig
    data: CardDataWrapper | null;
    loading: boolean;
};

export function BlockCardRenderer({config, data, loading}: BlockCardRendererProps) {
    if (!data || loading) return null;

    switch (config.displayType) {
        case 'kpi-card': {
            const d = data as { data: KpiCardData };
            return <KpiCardLib kpiValue={d.data.value} kpiLabel={d.data.label}/>;
        }
        case 'kpi-bar-card': {
            const d = data as { data: KpiBarCardData };
            return (
                <KpiBarCardLib
                    title={d.data.title}
                    items={d.data.items}
                    maxValue={d.data.maxValue}
                    footer={d.data.footer}
                    showFooterDivider={d.data.showFooterDivider}
                />
            );
        }
        case 'summary-list-card': {
            const d = data as { data: SummaryListCardData };
            return <SummaryListCardLib title={d.data.title} items={d.data.items}/>;
        }
    }
}
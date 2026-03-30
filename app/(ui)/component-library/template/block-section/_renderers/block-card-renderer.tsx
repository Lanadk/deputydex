import {useEffect, useState} from "react";
import {CardConfig, CardDataWrapper} from "@/app/(ui)/component-library/template/block-section/card-config.types";
import {KpiCardLib} from "@/app/(ui)/component-library/molecules/kpi-card/kpi-card-lib";
import {KpiBarCardLib} from "@/app/(ui)/component-library/molecules/kpi-bar-card/kpi-bar-card-lib";
import {SummaryListCardLib} from "@/app/(ui)/component-library/molecules/summary-list-card/summary-list-card";

type BlockCardRendererProps = {
    config: CardConfig;
    legislature: number;
    gatewayParam?: any;
};

export function BlockCardRenderer({config, gatewayParam}: BlockCardRendererProps) {
    const [card, setCard] = useState<CardDataWrapper | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); //TODO fix
        config.gatewayFn(gatewayParam)
            .then(setCard)
            .finally(() => setLoading(false));
    }, [gatewayParam, config.id]);


    if (!card && !loading) return null;
    if (!card) return null;

    switch (card.type) {
        case 'kpi-card':
            return (
                <KpiCardLib
                    kpiValue={card.data.value}
                    kpiLabel={card.data.label}
                />
            );

        case "kpi-bar-card":
            return (
                <KpiBarCardLib
                    title={card.data.title}
                    items={card.data.items}
                    maxValue={card.data.maxValue}
                    footer={card.data.footer}
                    showFooterDivider={card.data.showFooterDivider}
                />
            );

        case "summary-list-card":
            return (
                <SummaryListCardLib
                    title={card.data.title}
                    items={card.data.items}
                />
            );

        default:
            return null;
    }
}
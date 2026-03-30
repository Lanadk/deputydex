import {useEffect, useState} from "react";
import {BarChartLib} from "@/app/(ui)/component-library/molecules/chart/bar-chart/bar-chart-lib";
import {CardConfig, CardDataWrapper} from "@/app/(ui)/component-library/template/block-section/card-config.types";
import {KpiCardLib} from "@/app/(ui)/component-library/molecules/kpi-card/kpi-card-lib";

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
    }
}
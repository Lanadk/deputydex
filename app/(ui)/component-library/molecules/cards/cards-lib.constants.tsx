import {KpiCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";
import {KpiBarCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-bar-card/kpi-bar-card-lib";
import {SummaryListCardLib} from "@/app/(ui)/component-library/molecules/cards/summary-list-card/summary-list-card";

const KPI_CODE_SIMPLE_USAGE = `<KpiCardLib
    kpiValue="88"
    kpiLabel="membres"
/>`

const KPI_BAR_CARD_SIMPLE_USAGE = `<KpiBarCardLib
    title='Parité'
    items={[
        { label: 'Femmes', value: 50},
        { label: 'Hommes', value: 50},
    ]}
    maxValue={100}
/>`

const KPI_BAR_CARD_FOOTER_USAGE = `<KpiBarCardLib
    title='Parité'
    items={[
        { label: 'Femmes', value: 50},
        { label: 'Hommes', value: 50},
    ]}
    maxValue={100}
    footer='Donnée du 09/10/2022'
    showFooterDivider={true}
/>`

const SUMMARY_LIST_CARD_SIMPLE_USAGE = ``

const SUMMARY_LIST_CARD_BADGE_USAGE = ``


export const getCardsSections = () => [
    {
        title: 'KPI Card Simple usage',
        code: KPI_CODE_SIMPLE_USAGE,
        component: (
            <KpiCardLib
                kpiValue="88"
                kpiLabel="membres"
            />
        )
    },
    {
        title: 'KPI Bar card simple usage',
        code: KPI_BAR_CARD_SIMPLE_USAGE,
        component: (
            <KpiBarCardLib
                title='Parité'
                items={[
                    {label: 'Femmes', value: 50},
                    {label: 'Hommes', value: 50},
                ]}
                maxValue={100}
            />
        )
    },
    {
        title: 'KPI Bar card footer usage',
        code: KPI_BAR_CARD_FOOTER_USAGE,
        component: (
            <KpiBarCardLib
                title='Parité'
                items={[
                    {label: 'Femmes', value: 50},
                    {label: 'Hommes', value: 50},
                ]}
                maxValue={100}
                footer='Donnée du 09/10/2022'
                showFooterDivider={true}
            />
        )
    },
    {
        title: 'Summary list card simple usage',
        code: SUMMARY_LIST_CARD_SIMPLE_USAGE,
        component: (
            <SummaryListCardLib
                title='Députes'
                items={[
                    {label: 'Femmes', value: 25},
                    {label: 'Femmes', value: 25},
                    {label: 'Hommes', value: 25},
                    {label: 'Hommes', value: 25},
                ]}
            />
        )
    },
    {
        title: 'Summary list card badge usage',
        code: SUMMARY_LIST_CARD_BADGE_USAGE,
        component: ( //TODO fix this
        //    <SummaryListCardLib
        //        title='Députes'
        //        items={[
        //            { label: 'Femmes', badge: { text: 'F', variant: 'primary' } },
        //            { label: 'Hommes', badge: { text: 'H', variant: 'secondary' } },
        //        ]}
        //    />
            <></>
        )
    },
];
import {KpiCardLib} from "@/app/(ui)/component-library/molecules/cards/kpi-card/kpi-card-lib";

const KPI_CODE_SIMPLE_USAGE = `<KpiCardLib
    kpiValue="88"
    kpiLabel="membres"
/>
`

export const getKpiCardSections = () => [{
    title: "Simple usage",
    code: KPI_CODE_SIMPLE_USAGE,
    component: (
        <KpiCardLib
            kpiValue="88"
            kpiLabel="membres"
        />
    )
}];
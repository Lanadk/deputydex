import {CardConfig} from "@/app/(ui)/component-library/template/block-section/card-config.types";

export const GROUPES_KPI_REGISTRY: CardConfig[] = [
    {
        id: 'kpi-actif-members',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'membres actifs', value: 122}
                : {label: 'membres actifs', value: 91},
        }),
    },
    {
        id: 'kpi-age-average',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'âge moyen, moy Ass: 50ans', value: 51}
                : {label: 'âge moyen, moy Ass: 49ans', value: 50},
        }),
    },
    {
        id: 'kpi-femmes-percent',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'de femmes, moy Ass: 36%', value: '38%'}
                : {label: 'de femmes, moy Ass: 35%', value: '36%'},
        }),
    },
    {
        id: 'kpi-deputy-seniority',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'mandat cumulé moyen', value: '6.2 ans'}
                : {label: 'mandat cumulé moyen', value: '5.2 ans'},
        }),
    },
];



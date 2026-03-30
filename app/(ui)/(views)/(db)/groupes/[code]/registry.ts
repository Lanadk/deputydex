import {makeRegistryHelper} from "@/app/(ui)/_shared/registry/registry.helper";
import {
    ActivityCalendarConfig
} from "@/app/(ui)/component-library/template/block-section/activity-calendar-config.types";
import {CardConfig} from "@/app/(ui)/component-library/template/block-section/card-config.types";
import {TableConfig} from "@/app/(ui)/component-library/template/block-section/table-config.types";
import {ChartConfig, ChartDataWrapper} from "@/app/(ui)/component-library/template/block-section/chart-config.types";

//Calendar
export const sampleData = [
    {date: '2024-01-01', count: 0, level: 0}, // Début année
    {date: '2024-01-15', count: 5, level: 2},
    {date: '2024-02-10', count: 8, level: 2},
    {date: '2024-03-05', count: 12, level: 3},
    {date: '2024-03-06', count: 10, level: 3},
    {date: '2024-03-08', count: 5, level: 3},
    {date: '2024-04-20', count: 16, level: 4},
    {date: '2024-05-12', count: 3, level: 1},
    {date: '2024-06-23', count: 2, level: 1},
    {date: '2024-07-18', count: 9, level: 3},
    {date: '2024-08-02', count: 16, level: 4},
    {date: '2024-09-14', count: 7, level: 2},
    {date: '2024-10-25', count: 14, level: 3},
    {date: '2024-11-29', count: 11, level: 3},
    {date: '2024-12-31', count: 0, level: 0}, // Fin année
];

const GROUPES_ACTIVITY_CALENDAR: ActivityCalendarConfig[] = [
    {
        id: 'groupe-activity-calendar',
        gatewayFn: async () => ({
            type: 'activity-calendar-tooltip-and-href',
            data: sampleData
        }),
    }
]

//Cards
const GROUPES_KPI_REGISTRY: CardConfig[] = [
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
    {
        id: 'kpi-deputy-parity',
        gatewayFn: async (legislature) => ({
            type: "kpi-bar-card",
            data: {
                title: "Parité",
                maxValue: 100,
                items: [
                    {label: "Femmes", value: 38, displayValue: "38%"},
                    {label: "Hommes", value: 62, displayValue: "62%", color: "#93c5fd"},
                ],
                footer: "Mieux que la moyenne nationale (36% de femmes)",
            },
        }),
    },
    {
        id: 'kpi-deputy-location-from',
        gatewayFn: async (legislature) => ({
            type: "kpi-bar-card",
            data: {
                title: "Top départements",
                maxValue: 12,
                items: [
                    {label: "Paris (75)", value: 12},
                    {label: "Bouches-du-Rhône", value: 7},
                    {label: "Nord", value: 5},
                    {label: "Rhône", value: 4},
                ],
            },
        }),
    },
    {
        id: 'kpi-last-votes',
        gatewayFn: async (legislature) => ({
            type: 'summary-list-card',
            data: {
                title: '5 derniers scrutins',
                items: legislature === 17
                    ? [
                        {label: 'PLF 2025 — amendement art. 12', badge: {text: 'Pour', variant: 'primary'}},
                        {label: 'Motion de censure — 15 jan.', badge: {text: 'Contre', variant: 'secondary'}},
                        {label: 'Texte retraites — art. 7', badge: {text: 'Pour', variant: 'primary'}},
                        {label: 'Loi immigration — vote final', badge: {text: 'Abst.', variant: 'tertiary'}},
                        {label: 'Budget sécu. — art. 3', badge: {text: 'Pour', variant: 'primary'}},
                    ]
                    : [
                        {label: 'PLF 2024 — art. 49', badge: {text: 'Contre', variant: 'secondary'}},
                        {label: 'Motion de censure — 20 mars', badge: {text: 'Pour', variant: 'primary'}},
                        {label: 'Loi retraites — vote solennel', value: 'Non-votant'},
                        {label: 'Budget rectificatif', badge: {text: 'Abst.', variant: 'tertiary'}},
                        {label: 'Loi SREN — art. 6', badge: {text: 'Pour', variant: 'primary'}},
                    ],
            },
        }),
    },
    {
        id: 'kpi-groupe-vote-cohesion',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'cohésion de vote, rang: 3e/13', value: '91%'}
                : {label: 'cohésion de vote, rang: 3e/13', value: '88%'},
        }),
    },
    {
        id: 'kpi-groupe-nb-scrutins-legislature',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'scrutins depuis 2022', value: 312}
                : {label: 'scrutins depuis 2022', value: 487},
        }),
    },
    {
        id: 'kpi-groupe-gouvernement-proximity',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'avec le gouvernement. proximité', value: '64%'}
                : {label: 'avec le gouvernement. proximité', value: '71%'},
        }),
    },
    {
        id: 'kpi-groupe-average-scruttin-presence-legislature',
        gatewayFn: async (legislature) => ({
            type: 'kpi-card',
            data: legislature === 17
                ? {label: 'présence moyenne, rang: 2e/13', value: '78%'}
                : {label: 'présence moyenne, rang: 2e/13', value: '75%'},
        }),
    },
];

//Table registry
type DeputeActiviteRow = {
    id: string;
    nom: string;
    groupe: string;
    presence: number;
    amendements: number;
    propositions: number;
};

const GROUPE_TABLE_REGISTRY: TableConfig<any>[] = [{
    id: "groupe-members-table",
    gatewayFn: async (legislature: number) => {
        // TODO: remplacer par statisticsGateway.getActivite(legislature)
        return [
            {id: "1", nom: "Jean Dupont", groupe: "EPR", presence: 92, amendements: 34, propositions: 5},
            {id: "2", nom: "Marie Martin", groupe: "SOC", presence: 78, amendements: 67, propositions: 3},
            {id: "3", nom: "Paul Bernard", groupe: "RN", presence: 61, amendements: 12, propositions: 1},
            {id: "4", nom: "Lucie Moreau", groupe: "EPR", presence: 88, amendements: 21, propositions: 7},
            {id: "5", nom: "Ahmed Kader", groupe: "LFI-NFP", presence: 95, amendements: 89, propositions: 4},
        ] as DeputeActiviteRow[];
    },
    columns: [
        {id: "nom", header: "Député", align: "center", cell: (r: DeputeActiviteRow) => r.nom},
        {id: "groupe", header: "Groupe", align: "center", cell: (r: DeputeActiviteRow) => r.groupe},
        {id: "presence", header: "Présence (%)", align: "center", cell: (r: DeputeActiviteRow) => `${r.presence} %`},
        {id: "amendements", header: "Amendements", align: "center", cell: (r: DeputeActiviteRow) => r.amendements},
        {id: "propositions", header: "Propositions", align: "center", cell: (r: DeputeActiviteRow) => r.propositions},
    ],
    getRowKey: (r: DeputeActiviteRow) => r.id,
    pagination: {pageSize: 10},
} as TableConfig<DeputeActiviteRow>,
];

const GROUPE_CHART_REGISTRY: ChartConfig[] = [
    {
        id: 'chart-groupe-professions-familles',
        title: 'Familles de profession du groupe',
        theme: 'profession famille',
        gatewayFn: async (legislature: number) => ({
            type: 'bar',
            data: legislature === 17
                ? [
                    {label: 'Sans profession déclarée', value: 12},
                    {label: 'Agriculteurs exploitants', value: 12},
                    {label: 'Ouvriers', value: 1},
                    {label: 'Employés', value: 34},
                    {label: 'Professions Intermédiaires', value: 6},
                    {label: 'Cadres et professions intellectuelles supérieures', value: 7},
                    {label: 'Artisans, commerçants et chefs d\'entreprise', value: 6},
                    {label: 'Retraités', value: 2},
                ]
                : [
                    {label: 'Sans profession déclarée', value: 12},
                    {label: 'Agriculteurs exploitants', value: 12},
                    {label: 'Ouvriers', value: 1},
                    {label: 'Employés', value: 34},
                    {label: 'Professions Intermédiaires', value: 6},
                    {label: 'Cadres et professions intellectuelles supérieures', value: 7},
                    {label: 'Artisans, commerçants et chefs d\'entreprise', value: 6},
                    {label: 'Retraités', value: 2},
                ],
        })
    },
    {
        id: 'chart-groupe-professions-gaterorie',
        title: 'Categories de profession du groupe',
        theme: 'profession categorie',
        gatewayFn: async (legislature: number) => ({
            type: 'bar',
            data: legislature === 17
                ? [
                    {label: 'Agriculteurs exploitants', value: 12},
                    {label: 'Artisans, commerçants et chefs d\'entreprise', value: 1},
                    {label: 'Cadres et professions intellectuelles supérieures', value: 34},
                    {label: 'Professions intermédiaires', value: 6},
                    {label: 'Sans profession déclarée', value: 7},
                    {label: 'Cadres d\'entreprise', value: 2},
                ]
                : [
                    {label: 'Agriculteurs exploitants', value: 12},
                    {label: 'Artisans, commerçants et chefs d\'entreprise', value: 1},
                    {label: 'Cadres et professions intellectuelles supérieures', value: 34},
                    {label: 'Professions intermédiaires', value: 6},
                    {label: 'Sans profession déclarée', value: 7},
                    {label: 'Cadres d\'entreprise', value: 2},
                ],
        })
    }
];

//Registry helpers
export const card = makeRegistryHelper(GROUPES_KPI_REGISTRY, "CardConfig");
export const activityCalendar = makeRegistryHelper(GROUPES_ACTIVITY_CALENDAR, "ActivityCalendarConfig")
export const table = makeRegistryHelper(GROUPE_TABLE_REGISTRY, "TableConfig");
export const chart = makeRegistryHelper(GROUPE_CHART_REGISTRY, "ChartConfig");

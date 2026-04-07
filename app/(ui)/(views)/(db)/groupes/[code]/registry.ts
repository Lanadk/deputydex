import {makeRegistryHelper} from "@/app/(ui)/_shared/registry/registry.helper";
import {
    ActivityCalendarConfig
} from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import {CardConfig} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import {TableConfig} from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import {ChartConfig} from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";

//todo a virer
type GroupeMemberRow = {
    id: string;
    nom: string;
    groupe: string;
    presence: number;
    amendements: number;
    propositions: number;
};

//Calendar registry
const GROUPES_ACTIVITY_CALENDAR: ActivityCalendarConfig[] = [
    {
        id: 'groupe-activity-calendar',
        displayType: 'tooltip-and-href'
    }
]

//Table registry
const GROUPE_TABLE_REGISTRY: TableConfig<any>[] = [{
    id: "groupe-members-table",
    columns: [
        {id: "nom", header: "Député", align: "center", cell: (r: GroupeMemberRow) => r.nom},
        {id: "groupe", header: "Groupe", align: "center", cell: (r: GroupeMemberRow) => r.groupe},
        {id: "presence", header: "Présence (%)", align: "center", cell: (r: GroupeMemberRow) => `${r.presence} %`},
        {id: "amendements", header: "Amendements", align: "center", cell: (r: GroupeMemberRow) => r.amendements},
        {id: "propositions", header: "Propositions", align: "center", cell: (r: GroupeMemberRow) => r.propositions},
    ],
    getRowKey: (r: GroupeMemberRow) => r.id,
    pagination: {pageSize: 10},
}];

//card registry
const GROUPES_KPI_REGISTRY: CardConfig[] = [
    {id: 'kpi-actif-members', displayType: 'kpi-card'},
    {id: 'kpi-age-average', displayType: 'kpi-card'},
    {id: 'kpi-femmes-percent', displayType: 'kpi-card'},
    {id: 'kpi-deputy-seniority', displayType: 'kpi-card'},
    {id: 'kpi-deputy-parity', displayType: 'kpi-bar-card'},
    {id: 'kpi-deputy-location-from', displayType: 'kpi-bar-card'},
    {id: 'kpi-last-votes', displayType: 'summary-list-card'},
    {id: 'kpi-groupe-vote-cohesion', displayType: 'kpi-card'},
    {id: 'kpi-groupe-nb-scrutins-legislature', displayType: 'kpi-card'},
    {id: 'kpi-groupe-gouvernement-proximity', displayType: 'kpi-card'},
    {id: 'kpi-groupe-average-scruttin-presence-legislature', displayType: 'kpi-card'},
];

//chart registry
const GROUPE_CHART_REGISTRY: ChartConfig[] = [
    {
        id: 'chart-groupe-professions-familles',
        title: 'Familles de profession du groupe',
        theme: 'profession famille',
        displayType: 'bar'
    },
    {
        id: 'chart-groupe-professions-gaterorie',
        title: 'Categories de profession du groupe',
        theme: 'profession categorie',
        displayType: 'bar'
    },
];

//Registry helpers
export const card = makeRegistryHelper(GROUPES_KPI_REGISTRY, "CardConfig");
export const activityCalendar = makeRegistryHelper(GROUPES_ACTIVITY_CALENDAR, "ActivityCalendarConfig")
export const table = makeRegistryHelper(GROUPE_TABLE_REGISTRY, "TableConfig");
export const chart = makeRegistryHelper(GROUPE_CHART_REGISTRY, "ChartConfig");

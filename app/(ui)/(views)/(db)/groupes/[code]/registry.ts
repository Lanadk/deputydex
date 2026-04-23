import {makeRegistryHelper} from "@/app/(ui)/_shared/registry/registry.helper";
import {ActivityCalendarConfig} from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import {CardConfig} from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import {TableConfig} from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import {ChartConfig} from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";

//Calendar registry
const GROUPES_ACTIVITY_CALENDAR: ActivityCalendarConfig[] = [
    {id: 'groupe-activity-calendar', displayType: 'tooltip-and-href'}
];

//Table registry
const GROUPE_TABLE_REGISTRY: TableConfig<GroupeMembersDTO>[] = [{
    id: "groupe-members-table",
    columns: [
        {
            id: "prenom",
            header: "Prénom",
            align: "center",
            cell: (r: GroupeMembersDTO) => r.deputyFirstName
        },
        {
            id: "nom",
            header: "Nom",
            align: "center",
            cell: (r: GroupeMembersDTO) => r.deputyLastName
        },
        {
            id: "circonscription",
            header: "Circonscription",
            align: "center",
            cell: (r: GroupeMembersDTO) => r.circonscription
        },
        {
            id: "age",
            header: "Âge",
            align: "center",
            cell: (r: GroupeMembersDTO) => r.age
        },
        {
            id: "since",
            header: "Membre depuis",
            align: "center",
            cell: (r: GroupeMembersDTO) => new Date(r.since).toLocaleDateString('fr-FR')
        },
    ],
    getRowKey: (r: GroupeMembersDTO) => `${r.deputyLastName}-${r.deputyFirstName}`,
    pagination: {pageSize: 10},
}];

//Card registry
const GROUPES_KPI_REGISTRY: CardConfig[] = [
    {id: 'kpi-actif-members', displayType: 'kpi-card'},
    {id: 'kpi-age-average', displayType: 'kpi-card'},
    {id: 'kpi-femmes-percent', displayType: 'kpi-card'},
    {id: 'kpi-deputy-seniority', displayType: 'kpi-card'},
    {id: 'kpi-deputy-parity', displayType: 'kpi-bar-card'},
    {id: 'kpi-deputy-location-from-election', displayType: 'kpi-bar-card'},
    {id: 'kpi-deputy-location-from-birth-dep', displayType: 'kpi-bar-card'},
    {id: 'kpi-deputy-location-from-birth-pays', displayType: 'kpi-bar-card'},
    {id: 'kpi-last-votes', displayType: 'summary-list-card'},
    {id: 'kpi-deputy-tranche-age', displayType: 'kpi-bar-card'},
    {id: 'kpi-groupe-vote-cohesion', displayType: 'kpi-card'},
    {id: 'kpi-groupe-nb-scrutins-legislature', displayType: 'kpi-card'},
    {id: 'kpi-groupe-gouvernement-proximity', displayType: 'kpi-card'},
    {id: 'kpi-groupe-average-scruttin-presence-legislature', displayType: 'kpi-card'},
    {id: 'kpi-extreme-plus-age', displayType: 'kpi-card'},
    {id: 'kpi-extreme-plus-jeune', displayType: 'kpi-card'},
    {id: 'kpi-extreme-plus-experimente', displayType: 'kpi-card'},
    {id: 'kpi-extreme-moins-experimente', displayType: 'kpi-card'},
];

//Chart registry
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
    {
        id: 'chart-deputy-parity',
        title: 'Parité au sein du groupe parlementaire',
        theme: 'parity',
        displayType: 'donut'
    },
    {
        id: 'chart-evolution-cohesion-legislature',
        title: 'Evolution de la cohésion durant la législature',
        theme: 'cohesion',
        displayType: 'line'
    },
    {
        id: 'chart-evolution-participation-legislature',
        title: 'Evolution de la participation durant la législature',
        theme: 'participation',
        displayType: 'line'
    }
];

//Registry helpers
export const card = makeRegistryHelper(GROUPES_KPI_REGISTRY, "CardConfig");
export const activityCalendar = makeRegistryHelper(GROUPES_ACTIVITY_CALENDAR, "ActivityCalendarConfig");
export const table = makeRegistryHelper(GROUPE_TABLE_REGISTRY, "TableConfig");
export const chart = makeRegistryHelper(GROUPE_CHART_REGISTRY, "ChartConfig");
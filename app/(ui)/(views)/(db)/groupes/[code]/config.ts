import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {
    BlockDataWrapper,
    SectionBlock
} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {CalendarDays, Users, Vote} from "lucide-react";
import {MdOutlineGroups2} from "react-icons/md";
import {activityCalendar, card, chart, table} from "@/app/(ui)/(views)/(db)/groupes/[code]/registry";
import {ScrutinResultDTO} from "@/app/domains/scrutins/dto/scrtins-result.dto";
import {positionToBadge} from "@/app/(ui)/_shared/adapter/summary-list-card.adapter";
import {CardDataWrapper, SummaryListItem} from "@/app/(ui)/component-library/template/block-section/card-config.types";

export interface GroupesSection extends AnchorSection {
    description: string;
    cols: 1 | 2 | 3 | 4;
    blocks: SectionBlock[];
    gatewayFn?: (legislature: number) => Promise<Record<string, BlockDataWrapper>>;
    lazy?: boolean;
}

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

// TODO: const scrutins = await groupesGateways.getDerniersScrutins(code, legislature);
const scrutins: ScrutinResultDTO[] = [
    { label: 'PLF 2025 — amendement art. 12', position: 'pour'       },
    { label: 'Motion de censure — 15 jan.',   position: 'contre'     },
    { label: 'Texte retraites — art. 7',      position: 'pour'       },
    { label: 'Loi immigration — vote final',  position: 'pour' },
    { label: 'Budget sécu. — art. 3',         position: 'pour'       },
];

export const GROUPES_SECTIONS: GroupesSection[] = [
    //activity calendar section
    {
        id: 'groupe-activity',
        label: 'Activité du groupe',
        icon: CalendarDays,
        description: "Consulter l'activité du groupe parlementaire sur la derniere année",
        cols: 4,
        gatewayFn: async (_legislature) => ({
            'groupe-activity-calendar': {
                data: sampleData, // TODO: groupesGateways.getActivity(legislature)
            },
        }),
        blocks: [
            {type: 'activity-calendar', colSpan: 4, config: activityCalendar('groupe-activity-calendar')}
        ],
    },
    //membres du groupe
    {
        id: 'groupe-members',
        label: 'Members du groupe',
        icon: MdOutlineGroups2,
        description: 'Parcourer la liste de tous les membres du groupe parlementaire',
        cols: 4,
        lazy: true, // tableau lourd → chargé au scroll
        gatewayFn: async (_legislature) => ({
            'groupe-members-table': [
                {id: "1", nom: "Jean Dupont", groupe: "EPR", presence: 92, amendements: 34, propositions: 5},
                {id: "2", nom: "Marie Martin", groupe: "SOC", presence: 78, amendements: 67, propositions: 3},
                {id: "3", nom: "Paul Bernard", groupe: "RN", presence: 61, amendements: 12, propositions: 1},
                {id: "4", nom: "Lucie Moreau", groupe: "EPR", presence: 88, amendements: 21, propositions: 7},
                {id: "5", nom: "Ahmed Kader", groupe: "LFI-NFP", presence: 95, amendements: 89, propositions: 4},
                // TODO: groupesGateways.getMembers(legislature)
            ],
        }),
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("groupe-members-table"),
                title: "Membre du groupe",
                subtitle: "Cliquer sur un député pour voir sa fiche",
                filter: undefined,
                export: undefined,
            }
        ],
    },
    //groupe composition section
    {
        id: 'groupe-composition',
        label: 'Composition du groupe',
        icon: Users,
        description: "Qui sont ses membres ?",
        cols: 4,
        // TODO: groupesGateways.getComposition(code, legislature)
        // → retourne: kpi-actif-members, kpi-age-average, kpi-femmes-percent,
        //             kpi-deputy-seniority, kpi-deputy-parity, kpi-deputy-location-from,
        //             chart-groupe-professions-familles, chart-groupe-professions-gaterorie
        gatewayFn: async (legislature) => ({
            'kpi-actif-members': {
                data: legislature === 17 ? {label: 'membres actifs', value: 122} : {label: 'membres actifs', value: 91}
            },
            'kpi-age-average': {
                data: legislature === 17 ? {label: 'âge moyen', value: 51} : {label: 'âge moyen', value: 50}
            },
            'kpi-femmes-percent': {
                data: legislature === 17 ? {label: 'de femmes', value: '38%'} : {label: 'de femmes', value: '36%'}
            },
            'kpi-deputy-seniority': {
                data: legislature === 17 ? {
                    label: 'mandat cumulé moyen',
                    value: '6.2 ans'
                } : {label: 'mandat cumulé moyen', value: '5.2 ans'}
            },
            'kpi-deputy-parity': {
                data: {
                    title: 'Parité', maxValue: 100,
                    items: [
                        {label: 'Femmes', value: 38, displayValue: '38%'},
                        {label: 'Hommes', value: 62, displayValue: '62%', color: '#93c5fd'},
                    ],
                    footer: 'Mieux que la moyenne nationale (36% de femmes)',
                },
            },
            'kpi-deputy-location-from': {
                data: {
                    title: 'Top départements', maxValue: 12,
                    items: [
                        {label: 'Paris (75)', value: 12},
                        {label: 'Bouches-du-Rhône', value: 7},
                        {label: 'Nord', value: 5},
                        {label: 'Rhône', value: 4},
                    ],
                },
            },
            'chart-groupe-professions-familles': {
                type: 'bar',
                data: [
                    {label: 'Sans profession déclarée', value: 12},
                    {label: 'Agriculteurs exploitants', value: 12},
                    {label: 'Ouvriers', value: 1},
                    {label: 'Employés', value: 34},
                    {label: 'Professions Intermédiaires', value: 6},
                    {label: 'Cadres et professions intellectuelles supérieures', value: 7},
                    {label: 'Artisans, commerçants et chefs d\'entreprise', value: 6},
                    {label: 'Retraités', value: 2},
                ],
            },
            'chart-groupe-professions-gaterorie': {
                type: 'bar',
                data: [
                    {label: 'Agriculteurs exploitants', value: 12},
                    {label: 'Artisans, commerçants et chefs d\'entreprise', value: 1},
                    {label: 'Cadres et professions intellectuelles supérieures', value: 34},
                    {label: 'Professions intermédiaires', value: 6},
                    {label: 'Sans profession déclarée', value: 7},
                    {label: 'Cadres d\'entreprise', value: 2},
                ],
            },
            // TODO: groupesGateways.getComposition(legislature)
        }),
        blocks: [
            {type: 'card', colSpan: 1, config: card('kpi-actif-members')},
            {type: 'card', colSpan: 1, config: card('kpi-age-average')},
            {type: 'card', colSpan: 1, config: card('kpi-femmes-percent')},
            {type: 'card', colSpan: 1, config: card('kpi-deputy-seniority')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-parity')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-location-from')},
            {type: 'chart', colSpan: 4, config: chart('chart-groupe-professions-familles')},
            {type: 'chart', colSpan: 4, config: chart('chart-groupe-professions-gaterorie')},
        ],
    },
    {
        id: 'votes-cohesion',
        label: 'Votes & Cohésion',
        description: 'Comment le groupe vote-t-il ?',
        icon: Vote,
        cols: 4,
        gatewayFn: async (legislature) => ({
            'kpi-groupe-vote-cohesion': {
                data: legislature === 17 ? {
                    label: 'cohésion de vote, rang: 3e/13',
                    value: '91%'
                } : {label: 'cohésion de vote, rang: 3e/13', value: '88%'}
            },
            'kpi-groupe-nb-scrutins-legislature': {
                data: legislature === 17 ? {label: 'scrutins depuis 2022', value: 312} : {
                    label: 'scrutins depuis 2022',
                    value: 487
                }
            },
            'kpi-groupe-gouvernement-proximity': {
                data: legislature === 17 ? {
                    label: 'proximité gouvernement',
                    value: '64%'
                } : {label: 'proximité gouvernement', value: '71%'}
            },
            'kpi-groupe-average-scruttin-presence-legislature': {
                data: legislature === 17 ? {
                    label: 'présence moyenne, rang: 2e/13',
                    value: '78%'
                } : {label: 'présence moyenne, rang: 2e/13', value: '75%'}
            },
            'kpi-last-votes': {
                data: {
                    title: '5 derniers scrutins',
                    items: [
                        { label: 'PLF 2025 — amendement art. 12', badge: { text: 'Pour',   variant: 'primary'   } },
                        { label: 'Motion de censure — 15 jan.',   badge: { text: 'Contre', variant: 'secondary' } },
                        { label: 'Texte retraites — art. 7',      badge: { text: 'Pour',   variant: 'primary'   } },
                        { label: 'Loi immigration — vote final',  badge: { text: 'Abst.',  variant: 'tertiary'  } },
                        { label: 'Budget sécu. — art. 3',         badge: { text: 'Pour',   variant: 'primary'   } },
                    ] satisfies SummaryListItem[],
                },
            } satisfies CardDataWrapper,
            // TODO: groupesGateways.getVotesCohesion(legislature)
        }),
        blocks: [
            {type: 'card', colSpan: 1, config: card('kpi-groupe-vote-cohesion')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-nb-scrutins-legislature')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-gouvernement-proximity')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-average-scruttin-presence-legislature')},
            {type: 'card', colSpan: 2, config: card('kpi-last-votes')},
        ],
    },
    //groupe comportement politique section
    {
        id: 'comportement-politique',
        label: 'Comportement politique',
        description: 'Comment le groupe vote-t-il ?',
        icon: Vote,
        cols: 4,
        blocks: []
    },

];
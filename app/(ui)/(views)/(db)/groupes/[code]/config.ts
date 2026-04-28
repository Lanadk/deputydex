import {CalendarDays, Users, Vote} from "lucide-react";
import {MdOutlineGroups2} from "react-icons/md";
import {activityCalendar, card, chart, table} from "@/app/(ui)/(views)/(db)/groupes/[code]/registry";
import {PageSection} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import {BlockDataWrapper, SectionBlock} from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {GroupeMembersDTO} from "@/app/domains/groupes/dto/groupe-members.dto";
import {GROUPE_MEMBERS_SORT_OPTIONS} from "@/app/domains/groupes/filters/groupe-members.filters";
import {GroupeCompositionDTO} from "@/app/domains/groupes/dto/groupe-composition.dto";
import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {GroupeComportementDTO} from "@/app/domains/groupes/dto/groupe-comportement.dto";

export const sampleData = [
    {date: '2024-01-01', count: 0, level: 0},
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
    {date: '2024-12-31', count: 0, level: 0},
];

export const GROUPES_SECTIONS: PageSection[] = [
    {
        id: 'groupe-activity',
        label: 'Activité du groupe',
        icon: CalendarDays,
        description: "Consulter l'activité du groupe parlementaire sur la derniere année",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ code, legislature }) => {
            const data = await groupesGateways.getGroupeActivityCalendar(
                code as string,
                legislature as number
            );

            return {
                'groupe-activity-calendar': {
                    data,
                },
            };
        },
        actions: {
            onActivityClick: async ({ date, code, legislature }) => {
                const details =
                    await groupesGateways.getGroupeActivityCalendarDetails(
                        code,
                        legislature,
                        date
                    );

                console.log("DETAILS :", details);
            }
        },
        blocks: [
            {
                type: 'activity-calendar',
                colSpan: 4,
                config: activityCalendar('groupe-activity-calendar')
            }
        ],
    },
    {
        id: 'groupe-members',
        label: 'Members du groupe',
        icon: MdOutlineGroups2,
        description: 'Parcourer la liste de tous les membres du groupe parlementaire',
        cols: 4,
        lazy: false,
        gatewayFn: async ({code, legislature}: Record<string, unknown>) => {
            const members = await groupesGateways.getGroupeMembers(code as string, legislature as number);
            return { 'groupe-members-table': members } as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("groupe-members-table"),
                title: "Membres du groupe",
                subtitle: "Cliquer sur un député pour voir sa fiche",
                filter: {
                    sortOptions: GROUPE_MEMBERS_SORT_OPTIONS,
                    filterFields: undefined,
                    applyMode: "auto",
                },
                export: undefined,
            } satisfies SectionBlock<GroupeMembersDTO>
        ],
    },
    {
        id: 'groupe-composition',
        label: 'Composition du groupe',
        icon: Users,
        description: "Qui sont ses membres ?",
        cols: 4,
        lazy: false,
        gatewayFn: async ({code, legislature}: Record<string, unknown>) => {
            const composition: GroupeCompositionDTO = await groupesGateways.getGroupeComposition(code as string, legislature as number);

            return {
                'kpi-extreme-plus-age': {
                    data: {
                        label: 'Député le plus âgé',
                        value: composition.groupeExtremes?.plusAge
                            ? `${composition.groupeExtremes.plusAge.nom} (${composition.groupeExtremes.plusAge.age} ans)`
                            : '-',
                    }
                },
                'kpi-extreme-plus-jeune': {
                    data: {
                        label: 'Député le plus jeune',
                        value: composition.groupeExtremes?.plusJeune
                            ? `${composition.groupeExtremes.plusJeune.nom} (${composition.groupeExtremes.plusJeune.age} ans)`
                            : '-',
                    }
                },
                'kpi-actif-members': {
                    data: {label: 'membres actifs', value: composition.groupeCountActifMembers ?? 0}
                },
                'kpi-age-average': {
                    data: {label: 'âge moyen', value: composition.groupeAverageMemberAge ?? 0}
                },
                'kpi-femmes-percent': {
                    data: {label: 'de femmes', value: `${composition.groupeAverageFemmePercent ?? 0}%`}
                },
                'kpi-deputy-seniority': {
                    data: {label: 'mandat cumulé moyen', value: `${composition.groupeAverageCumulatedMandat ?? 0} ans`}
                },
                'kpi-deputy-tranche-age': {
                    data: {
                        title: 'Tranche d\'âge des députés',
                        maxValue: Math.max(...(composition.groupeTrancheAge ?? []).map(d => d.acteursCount), 1),
                        items: (composition.groupeTrancheAge ?? []).map(d => ({
                            label: d.label,
                            value: d.acteursCount,
                        })),
                    },
                },
                'kpi-deputy-location-from-election': {
                    data: {
                        title: 'Top départements élection',
                        maxValue: Math.max(...(composition.groupeTopDepartementsElection ?? []).map(d => d.count), 1),
                        items: (composition.groupeTopDepartementsElection ?? []).map(d => ({
                            label: d.label,
                            value: d.count,
                        })),
                    },
                },
                'kpi-deputy-location-from-birth-dep': {
                    data: {
                        title: 'Top départements de naissance',
                        maxValue: Math.max(...(composition.groupeTopDepartementsNaissance ?? []).map(d => d.count), 1),
                        items: (composition.groupeTopDepartementsNaissance ?? []).map(d => ({
                            label: d.label,
                            value: d.count,
                        })),
                    },
                },
                'kpi-deputy-location-from-birth-pays': {
                    data: {
                        title: 'Top Pays de naissance',
                        maxValue: Math.max(...(composition.groupeTopPaysNaissance ?? []).map(d => d.count), 1),
                        items: (composition.groupeTopPaysNaissance ?? []).map(d => ({
                            label: d.label,
                            value: d.count,
                        })),
                    },
                },
                'kpi-deputy-parity': {
                    data: {
                        title: 'Parité',
                        maxValue: 100,
                        items: [
                            {label: 'Femmes', value: composition.groupeParite.femme, displayValue: `${composition.groupeParite.femme}%`},
                            {label: 'Hommes', value: composition.groupeParite.homme, displayValue: `${composition.groupeParite.homme}%`, color: '#93c5fd'},
                        ],
                        footer: `${composition.groupeParite.femme}% de femmes dans le groupe`,
                    },
                },
                'chart-deputy-parity': {
                    type: 'donut',
                    data: [
                        {label: 'Hommes', value: composition.groupeParite.homme},
                        {label: 'Femmes', value: composition.groupeParite.femme}
                    ]
                },
                'chart-groupe-professions-familles': {
                    type: 'bar',
                    data: (composition.groupeProfessionFamilles?.data ?? []).map(d => ({
                        label: d.label,
                        value: d.acteursCount,
                    })),
                },
                'chart-groupe-professions-gaterorie': {
                    type: 'bar',
                    data: (composition.groupeProfessionCategories?.data ?? []).map(d => ({
                        label: d.label,
                        value: d.acteursCount,
                    })),
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {type: 'card', colSpan: 1, config: card('kpi-actif-members')},
            {type: 'card', colSpan: 1, config: card('kpi-age-average')},
            {type: 'card', colSpan: 1, config: card('kpi-femmes-percent')},
            {type: 'card', colSpan: 1, config: card('kpi-deputy-seniority')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-location-from-election')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-location-from-birth-dep')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-tranche-age')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-location-from-birth-pays')},
            {type: 'card', colSpan: 1, config: card('kpi-extreme-plus-jeune')},
            {type: 'card', colSpan: 1, config: card('kpi-extreme-plus-age')},
            {type: 'chart', colSpan: 4, config: chart('chart-deputy-parity')},
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
        lazy: false,
        gatewayFn: async ({code, legislature}: Record<string, unknown>) => {
            const leg = legislature as number;
            const cohesion: GroupeCohesionDTO = await groupesGateways.getGroupeCohesion(code as string, leg);
            return {//TODO
                'kpi-groupe-vote-cohesion': {
                    data: {label: 'todo', value: leg === 17 ? 'todo' : 'todo'}
                },
                'kpi-groupe-nb-scrutins-legislature': {
                    data: {label: 'todo', value: leg === 17 ? null : null}
                },
                'kpi-groupe-gouvernement-proximity': {
                    data: {label: 'proximité gouvernement', value: leg === 17 ? 'todo' : 'todo'}
                },
                'kpi-groupe-average-scruttin-presence-legislature': {
                    data: {label: 'présence moyenne', value: leg === 17 ? 'todo' : 'todo'}
                },
                //'kpi-last-votes': { //TODO fix le composant
                   // data: {
                     //   title: '5 derniers scrutins',
                      //  items: [
                            //{label: 'PLF 2025 — amendement art. 12', badge: {text: 'Pour', variant: 'primary'}},
                            //{label: 'Motion de censure — 15 jan.', badge: {text: 'Contre', variant: 'secondary'}},
                          //  {label: 'Texte retraites — art. 7', badge: {text: 'Pour', variant: 'primary'}},
                        //    {label: 'Loi immigration — vote final', badge: {text: 'Abst.', variant: 'tertiary'}},
                      //      {label: 'Budget sécu. — art. 3', badge: {text: 'Pour', variant: 'primary'}},
                    //    ] satisfies SummaryListItem[],
                  //  },
                //},
                'chart-evolution-cohesion-legislature': {
                    type: 'line',
                    data: (cohesion.evolutionCohesionLegislature?? []).map(d => ({
                        label: d.key,
                        value: d.value
                    })),
                }
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {type: 'card', colSpan: 1, config: card('kpi-groupe-vote-cohesion')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-nb-scrutins-legislature')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-gouvernement-proximity')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-average-scruttin-presence-legislature')},
            {type: 'chart', colSpan: 4, config: chart('chart-evolution-cohesion-legislature')},
            {type: 'card', colSpan: 2, config: card('kpi-last-votes')},
        ],
    },
    {
        id: 'comportement-politique',
        label: 'Comportement politique',
        description: 'Comment le groupe vote-t-il ?',
        icon: Vote,
        cols: 4,
        lazy: false,
        gatewayFn: async ({code, legislature}: Record<string, unknown>) => {
            const leg = legislature as number;
            const comportement: GroupeComportementDTO = await groupesGateways.getGroupeComportement(code as string, leg);
            return {
                'chart-evolution-participation-legislature': {
                    type: 'line',
                    data: (comportement.evolutionParticipationLegislature?? []).map(d => ({
                        label: d.key,
                        value: d.value
                    })),
                }
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {type: 'chart', colSpan: 4, config: chart('chart-evolution-participation-legislature')},
        ]
    },
];
import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {SectionBlock} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {CalendarDays, Users, Vote} from "lucide-react";
import {MdOutlineGroups2} from "react-icons/md";
import {activityCalendar, card, table} from "@/app/(ui)/(views)/(db)/groupes/[code]/registry";

export interface GroupesSection extends AnchorSection {
    description: string;
    cols: 1 | 2 | 3 | 4;
    blocks: SectionBlock[];
}

export const GROUPES_SECTIONS: GroupesSection[] = [
    //activity calendar section
    {
        id: 'groupe-activity',
        label: 'Activité du groupe',
        icon: CalendarDays,
        description: "Consulter l'activité du groupe parlementaire sur la derniere année",
        cols: 4,
        blocks: [
            {type: 'activity-calendar', colSpan: 4, config: activityCalendar('groupe-activity-calendar')}
        ]
    },
    //membres du groupe
    {
        id: 'groupe-members',
        label: 'Members du groupe',
        icon: MdOutlineGroups2,
        description: 'Parcourer la liste de tous les membres du groupe parlementaire',
        cols: 4,
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
        ]
    },
    //groupe composition section
    {
        id: 'groupe-composition',
        label: 'Composition du groupes',
        icon: Users,
        description: "Qui sont ses membres ?",
        cols: 4,
        blocks: [
            {type: 'card', colSpan: 1, config: card('kpi-actif-members')},
            {type: 'card', colSpan: 1, config: card('kpi-age-average')},
            {type: 'card', colSpan: 1, config: card('kpi-femmes-percent')},
            {type: 'card', colSpan: 1, config: card('kpi-deputy-seniority')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-parity')},
            {type: 'card', colSpan: 2, config: card('kpi-deputy-location-from')},
        ],
    },
    //groupe Votes & Cohésion section
    {
        id: 'votes-cohesion',
        label: 'Votes & Cohésion',
        description: 'Comment le groupe vote-t-il ?',
        icon: Vote,
        cols: 4,
        blocks: [
            {type: 'card', colSpan: 1, config: card('kpi-groupe-vote-cohesion')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-nb-scrutins-legislature')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-gouvernement-proximity')},
            {type: 'card', colSpan: 1, config: card('kpi-groupe-average-scruttin-presence-legislature')},
            { type: 'card', colSpan: 2, config: card('kpi-last-votes') }, //TODO
            //{ type: 'chart', colSpan: 2, confg: chart('chart-groupe-')}
        ]
    },
    //groupe comportement politique section
    {
        id: 'comportement-politique',
        label: 'Comportement politique',
        description: 'Comment le groupe vote-t-il ?',
        icon: Vote,
        cols: 4,
        blocks: [
        ]
    },

];
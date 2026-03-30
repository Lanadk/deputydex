import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {SectionBlock} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {CalendarDays, Users} from "lucide-react";
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
            {
                type: 'activity-calendar',
                colSpan: 4,
                config: activityCalendar('groupe-activity-calendar')
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
            {
                type: 'card',
                colSpan: 1,
                config: card('kpi-actif-members')
            },
            {
                type: 'card',
                colSpan: 1,
                config: card('kpi-age-average')
            },
            {
                type: 'card',
                colSpan: 1,
                config: card('kpi-femmes-percent')
            },
            {
                type: 'card',
                colSpan: 1,
                config: card('kpi-deputy-seniority')
            },
        ],
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
];
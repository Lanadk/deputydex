import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import {SectionBlock} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {CalendarDays, Users} from "lucide-react";
import {GROUPES_KPI_REGISTRY} from "@/app/(ui)/(views)/(db)/groupes/[code]/groupes-kpi-card.registry";
import {CardConfig} from "@/app/(ui)/component-library/template/block-section/card-config.types";
import {
    ActivityCalendarConfig
} from "@/app/(ui)/component-library/template/block-section/activity-calendar-config.types";
import {GROUPES_ACTIVITY_CALENDAR} from "@/app/(ui)/(views)/(db)/groupes/[code]/groupes-activity-calendar.registry";


const card = (id: string): CardConfig => {
    const found = GROUPES_KPI_REGISTRY.find((s) => s.id === id);
    if (!found) throw new Error(`StatConfig introuvable : ${id}`);
    return found;
};

const activityCalendar = (id: string): ActivityCalendarConfig => {
    const found = GROUPES_ACTIVITY_CALENDAR.find((s) => s.id === id);
    if (!found) throw new Error(`StatConfig introuvable : ${id}`);
    return found;
}


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
    }
];
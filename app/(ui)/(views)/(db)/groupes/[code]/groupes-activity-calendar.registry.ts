import {
    ActivityCalendarConfig
} from "@/app/(ui)/component-library/template/block-section/activity-calendar-config.types";


export const sampleData = [
    { date: '2024-01-01', count: 0, level: 0 }, // Début année
    { date: '2024-01-15', count: 5, level: 2 },
    { date: '2024-02-10', count: 8, level: 2 },
    { date: '2024-03-05', count: 12, level: 3 },
    { date: '2024-03-06', count: 10, level: 3 },
    { date: '2024-03-08', count: 5, level: 3 },
    { date: '2024-04-20', count: 16, level: 4 },
    { date: '2024-05-12', count: 3, level: 1 },
    { date: '2024-06-23', count: 2, level: 1 },
    { date: '2024-07-18', count: 9, level: 3 },
    { date: '2024-08-02', count: 16, level: 4 },
    { date: '2024-09-14', count: 7, level: 2 },
    { date: '2024-10-25', count: 14, level: 3 },
    { date: '2024-11-29', count: 11, level: 3 },
    { date: '2024-12-31', count: 0, level: 0 }, // Fin année
];

export const GROUPES_ACTIVITY_CALENDAR : ActivityCalendarConfig[] = [
    {
        id: 'groupe-activity-calendar',
        gatewayFn: async () => ({
            type: 'activity-calendar-tooltip-and-href',
            data: sampleData
        }),
    }
]


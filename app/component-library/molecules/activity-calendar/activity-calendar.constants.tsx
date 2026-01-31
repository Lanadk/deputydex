import { cloneElement } from 'react';
import {ActivityCalendarLib} from "@/app/component-library/molecules/activity-calendar/activity-calendar";

export const sampleData = [
    { date: '2024-01-01', count: 0, level: 0 }, // Début année
    { date: '2024-01-15', count: 5, level: 2 },
    { date: '2024-02-10', count: 8, level: 2 },
    { date: '2024-03-05', count: 12, level: 3 },
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

export const ACTIVITY_CALENDAR_CODE_BASIC = `import { ActivityCalendarLib } from "@/components/activity-calendar-lib";

const data = [
  { date: '2024-01-01', count: 0, level: 0 },
  { date: '2024-06-23', count: 2, level: 1 },
  { date: '2024-08-02', count: 16, level: 4 },
  { date: '2024-12-31', count: 0, level: 0 },
];

<ActivityCalendarLib data={data} />`;

export const ACTIVITY_CALENDAR_CODE_WITH_TOOLTIP = `import { ActivityCalendarLib } from "@/components/activity-calendar-lib";

<ActivityCalendarLib 
    data={data}
    tooltips={{
        activity: {
            text: (activity) => \`\${activity.count} votes le \${activity.date}\`,
            placement: 'top',
            offset: 4,
            hoverRestMs: 150,
            withArrow: true,
        }
    }}
/>`;

export const ACTIVITY_CALENDAR_CODE_WITH_CLICK = `import { ActivityCalendarLib } from "@/components/activity-calendar-lib";
import { cloneElement } from 'react';

<ActivityCalendarLib 
    data={data}
    renderBlock={(block, activity) =>
        cloneElement(block, {
            onClick: () => {
                alert(\`Date: \${activity.date}\\nVotes: \${activity.count}\`);
            },
        })
    }
/>`;

export const ACTIVITY_CALENDAR_CODE_USE_CASE = `// Cas d'usage : Activité parlementaire
const deputyActivityData = [
  { date: '2024-01-01', count: 0, level: 0 },
  { date: '2024-01-15', count: 5, level: 2 }, // 5 votes
  { date: '2024-02-20', count: 12, level: 3 }, // 12 votes
  { date: '2024-03-10', count: 20, level: 4 }, // 20 votes
  { date: '2024-12-31', count: 0, level: 0 },
];

<div>
  <h3>Activité parlementaire - Député XYZ</h3>
  <ActivityCalendarLib 
    data={deputyActivityData}
    tooltips={{
        activity: {
            text: (activity) => \`\${activity.count} participations\`,
            placement: 'top',
            withArrow: true,
        }
    }}
  />
</div>`;

export const getActivityCalendarSections = () => [
    {
        title: "Usage basique",
        code: ACTIVITY_CALENDAR_CODE_BASIC,
        component: (
            <ActivityCalendarLib
                data={sampleData}
            />
        )
    },
    {
        title: "Avec tooltip",
        code: ACTIVITY_CALENDAR_CODE_WITH_TOOLTIP,
        component: (
            <ActivityCalendarLib
                data={sampleData}
                tooltips={{
                    activity: {
                        text: activity => `${activity.level} activities on ${activity.date}`,
                        placement: 'top',
                        offset: 6,
                        hoverRestMs: 300,
                        transitionStyles: {
                            duration: 100,
                            common: { fontFamily: 'monospace' },
                        },
                        withArrow: true,
                    },
                }}
            />
        )
    },
    {
        title: "Avec event handler (click)",
        code: ACTIVITY_CALENDAR_CODE_WITH_CLICK,
        component: (
            <ActivityCalendarLib
                data={sampleData}
                renderBlock={(block, activity) =>
                    cloneElement(block, {
                        onClick: () => {
                            alert(`Date: ${activity.date}\nVotes: ${activity.count}`);
                        },
                    })
                }
            />
        )
    },
    {
        title: "Cas d'usage (DeputyDex)",
        code: ACTIVITY_CALENDAR_CODE_USE_CASE,
        component: (
            <div className="space-y-4">
                <h4 className="font-semibold">Activité parlementaire - Député XYZ</h4>
                <ActivityCalendarLib
                    data={sampleData}
                    tooltips={{
                        activity: {
                            text: (activity) => `${activity.count} participations`,
                            placement: 'top',
                            withArrow: true,
                        }
                    }}
                />
                <p className="text-sm opacity-70">
                    Visualisation des votes et participations du député au fil de l'année
                </p>
            </div>
        )
    }
];
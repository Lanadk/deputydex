import {
    ActivityCalendarConfig, ActivityCalendarDataWrapper
} from "@/app/(ui)/component-library/template/block-section/activity-calendar-config.types";
import {cloneElement, useEffect, useState} from "react";
import {ActivityCalendarLib} from "@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib";

type BlockActivityCalendarRendererProps = {
    config: ActivityCalendarConfig;
    legislature: number;
    gatewayParam?: any;
}


export function BlockActivityCalendarRenderer({config, gatewayParam}: BlockActivityCalendarRendererProps) {

    const [activityCalendar, setActivityCalendar] = useState<ActivityCalendarDataWrapper | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); //TODO fix
        config.gatewayFn(gatewayParam)
            .then(setActivityCalendar)
            .finally(() => setLoading(false));
    }, [gatewayParam, config.id]);

    if (!activityCalendar && !loading) return null;
    if (!activityCalendar) return null;

    switch (activityCalendar.type) {
        case 'activity-calendar-tooltip-and-href':
            return (
                <ActivityCalendarLib
                    data={activityCalendar.data}
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
                    renderBlock={(block, activity) =>
                        cloneElement(block, {
                            onClick: () => {
                                alert(`Date: ${activity.date}\nVotes: ${activity.count}`);
                            },
                        })
                    }
                />
            );
    }
}
import {
    ActivityCalendarConfig,
    ActivityCalendarDataWrapper
} from "@/app/(ui)/component-library/template/block-section/activity-calendar-config.types";
import {cloneElement} from "react";
import {ActivityCalendarLib} from "@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib";

type BlockActivityCalendarRendererProps = {
    config: ActivityCalendarConfig;
    data: ActivityCalendarDataWrapper | null;
    loading: boolean;
}

export function BlockActivityCalendarRenderer({config, data, loading}: BlockActivityCalendarRendererProps) {

    if (!data && !loading) return null;
    if (!data) return null;

    switch (config.displayType) {
        case 'tooltip-and-href':
            return (
                <ActivityCalendarLib
                    data={data.data}
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
import {
    ActivityCalendarConfig,
    ActivityCalendarDataWrapper
} from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import {cloneElement} from "react";
import {ActivityCalendarLib} from "@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib";

type BlockActivityCalendarRendererProps = {
    config: ActivityCalendarConfig;
    data: ActivityCalendarDataWrapper | null;
    loading: boolean;
    params: Record<string, unknown>;
    actions?: any;
}

export function BlockActivityCalendarRenderer({config, data, loading, params, actions}: BlockActivityCalendarRendererProps) {

    if (!data && !loading) return null;
    if (!data) return null;

    switch (config.displayType) {
        case 'tooltip-and-href':
            return (
                <ActivityCalendarLib
                    data={data.data}
                    tooltips={{
                        activity: {
                            text: activity => `${activity.count} activities on ${activity.date}`,
                            placement: 'top',
                            offset: 6,
                            hoverRestMs: 300,
                            transitionStyles: {
                                duration: 100,
                                common: {
                                    fontFamily: 'monospace',
                                    backgroundColor: '#223244',
                                    color: 'white',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                },
                            },
                            withArrow: true,
                        },
                    }}
                    renderBlock={(block, activity) =>
                        cloneElement(block, {
                            onClick: () => {
                                if (!activity?.date) return;
                                actions?.onActivityClick?.({
                                    date: activity.date,
                                    ...params
                                });
                            },
                            style: {
                                cursor: "pointer"
                            }
                        })
                    }
                />
            );
    }
}
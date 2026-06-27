export type ActivityCalendarDay = {
    date: string;
    count: number;
    level: number;
};

export type ActivityCalendarDisplayType =
    | 'basic'
    | 'tooltip'
    | 'tooltip-and-href';

export type ActivityCalendarDataWrapper = {
    data: ActivityCalendarDay[];
};

export type ActivityCalendarDetailItem = {
    date: string;
    domain: string;
    refId: string;
    meta: {
        type: string;
        [key: string]: any;
    };
};

export type ActivityCalendarConfig = {
    id: string;
    displayType: ActivityCalendarDisplayType;
    title?: string;
    subtitle?: string;
    //TODO fix je pense
    onClick?: (params: {
        date: string;
    }) => void | Promise<void>;
};
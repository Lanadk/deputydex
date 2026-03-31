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

export type ActivityCalendarConfig = {
    id: string;
    displayType: ActivityCalendarDisplayType;
    title?: string;
    subtitle?: string;
};
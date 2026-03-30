export type ActivityCalendarDataWrapper =
    | { type: 'activity-calendar'; data: any}
    | { type: 'activity-calendar-tooltip'; data: any}
    | { type: 'activity-calendar-tooltip-and-href'; data: any}



export type ActivityCalendarConfig = {
    id: string;
    title?: string;
    subtitle?: string;
    theme?: string;
    gatewayFn: (legislature: number) => Promise<ActivityCalendarDataWrapper>;
}
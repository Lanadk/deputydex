"use client"

import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { useTheme } from "next-themes";
import type { Props as ActivityCalendarProps } from "react-activity-calendar";

const getCalendarTheme = (currentTheme?: string): ThemeInput => {
    if (currentTheme === 'accessible') {
        return { light: ['#e6e6e6', '#003a8f'] };
    }

    return {
        light: ['#e5e7eb', '#2563eb'],
        dark: ['#27272a', '#3b82f6'],
    };
};

export interface ActivityCalendarLibProps extends Omit<ActivityCalendarProps, 'theme' | 'colorScheme'> {
    customTheme?: ThemeInput;
}

export const ActivityCalendarLib: React.FC<ActivityCalendarLibProps> = ({
                                                                            customTheme,
                                                                            ...props
                                                                        }) => {
    const { theme } = useTheme();
    const calendarTheme = customTheme || getCalendarTheme(theme);
    const colorScheme = theme === 'accessible' ? 'light' : (theme as 'light' | 'dark' | undefined);

    return (
        <ActivityCalendar
            {...props}
            theme={calendarTheme}
            colorScheme={colorScheme}
        />
    );
};
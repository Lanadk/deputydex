"use client"

import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import type { Props as ActivityCalendarProps } from "react-activity-calendar";

const getCSSVar = (name: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const getCalendarTheme = (): ThemeInput => {
    return {
        light: [
            getCSSVar('--p1-white-3'),
            getCSSVar('--p1-steel-2'),
            getCSSVar('--p1-blue-3'),
            getCSSVar('--p1-blue-4'),
            getCSSVar('--p1-red-3'),
        ],
    };
};

export interface ActivityCalendarLibProps extends Omit<ActivityCalendarProps, 'theme' | 'colorScheme'> {
    customTheme?: ThemeInput;
}

export const ActivityCalendarLib: React.FC<ActivityCalendarLibProps> = ({
                                                                            customTheme,
                                                                            ...props
                                                                        }) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, []);

    if (!mounted) {
        return <div style={{ height: 130 }} />;
    }

    const calendarTheme = customTheme || getCalendarTheme();
    const colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light';

    return (
        <ActivityCalendar
            {...props}
            theme={calendarTheme}
            colorScheme={colorScheme}
        />
    );
};
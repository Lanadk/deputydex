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
            getCSSVar('--p1-white-2'),
            getCSSVar('--p1-steel-2'),
            getCSSVar('--p1-blue-3'),
            getCSSVar('--p1-blue-4'),
            getCSSVar('--p1-red-3'),
        ],
    };
};

const BLOCK_MARGIN = 4;
const MIN_BLOCK_SIZE = 8;

function countWeeks(data: ActivityCalendarProps["data"]): number {
    if (!data || data.length === 0) return 53;

    const times = data.map((d) => new Date(d.date).getTime());
    const days = Math.round((Math.max(...times) - Math.min(...times)) / 86_400_000) + 1;

    return Math.max(1, Math.ceil(days / 7) + 1);
}

export interface ActivityCalendarLibProps extends Omit<ActivityCalendarProps, 'theme' | 'colorScheme'> {
    customTheme?: ThemeInput;
    /** Étire le calendrier sur toute la largeur du conteneur parent (défaut: false) */
    fullWidth?: boolean;
}

export const ActivityCalendarLib: React.FC<ActivityCalendarLibProps> = ({
                                                                            customTheme,
                                                                            fullWidth = false,
                                                                            ...props
                                                                        }) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, []);

    useEffect(() => {
        if (!fullWidth || !containerEl) return;

        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (width) setContainerWidth(width);
        });
        observer.observe(containerEl);
        return () => observer.disconnect();
    }, [fullWidth, containerEl]);

    if (!mounted) {
        return <div style={{ height: 130 }} />;
    }

    const calendarTheme = customTheme || getCalendarTheme();
    const colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light';

    let sizingProps: Pick<ActivityCalendarProps, "blockSize" | "blockMargin"> = {};
    if (fullWidth && containerWidth) {
        const weeks = countWeeks(props.data);
        const rawSize = (containerWidth - (weeks - 1) * BLOCK_MARGIN) / weeks;
        const blockSize = Math.max(MIN_BLOCK_SIZE, Math.floor(rawSize));
        sizingProps = { blockSize, blockMargin: BLOCK_MARGIN };
    }

    const calendar = (
        <ActivityCalendar
            {...props}
            {...sizingProps}
            theme={calendarTheme}
            colorScheme={colorScheme}
        />
    );

    if (!fullWidth) {
        return calendar;
    }

    return (
        <div ref={setContainerEl} className="w-full">
            {calendar}
        </div>
    );
};

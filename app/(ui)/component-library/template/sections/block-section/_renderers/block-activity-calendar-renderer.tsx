"use client";

import { cloneElement, useMemo, useState } from "react";
import {
    ActivityCalendarConfig,
    ActivityCalendarDataWrapper,
    ActivityCalendarDetailItem,
} from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import { ActivityCalendarLib } from "@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib";
import { SummaryListCardLib } from "@/app/(ui)/component-library/molecules/cards/summary-list-card/summary-list-card";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { SectionActions } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

type BlockActivityCalendarRendererProps = {
    config: ActivityCalendarConfig;
    data: ActivityCalendarDataWrapper | null;
    loading: boolean;
    params: Record<string, unknown>;
    actions?: SectionActions;
}

const DOMAIN_LABELS: Record<string, string> = {
    vote: "Vote",
    scrutin: "Scrutin",
    amendement: "Amendement déposé",
    amendement_co: "Amendement co-signé",
};

const DOMAIN_BADGE_VARIANTS: Record<string, "primary" | "secondary" | "tertiary"> = {
    vote: "primary",
    scrutin: "primary",
    amendement: "secondary",
    amendement_co: "tertiary",
};

const POSITION_LABELS: Record<string, string> = {
    pour: "Pour",
    contre: "Contre",
    abstention: "Abstention",
    non_votant: "Non-votant",
};

function describeActivity(item: ActivityCalendarDetailItem): string {
    const meta = item.meta ?? {};

    switch (item.domain) {
        case "vote": {
            const position = meta.position ? POSITION_LABELS[meta.position] ?? meta.position : null;
            const titre = meta.titre ? String(meta.titre) : "un scrutin";
            return position ? `Vote "${position}" sur ${titre}` : `Vote sur ${titre}`;
        }
        case "scrutin":
            return meta.titre ? String(meta.titre) : "Scrutin";
        case "amendement": {
            const titre = meta.titre ? ` : ${meta.titre}` : "";
            return `Amendement n°${meta.numero ?? "—"} déposé${meta.sort ? ` — ${meta.sort}` : ""}${titre}`;
        }
        case "amendement_co": {
            const titre = meta.titre ? ` : ${meta.titre}` : "";
            return `Amendement n°${meta.numero ?? "—"} co-signé${meta.sort ? ` — ${meta.sort}` : ""}${titre}`;
        }
        default:
            return item.refId;
    }
}

export function BlockActivityCalendarRenderer({config, data, loading, params, actions}: BlockActivityCalendarRendererProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [details, setDetails] = useState<ActivityCalendarDetailItem[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const years = useMemo(() => {
        if (!data) return [];
        const set = new Set(data.data.map((d) => Number(d.date.slice(0, 4))));
        return Array.from(set).sort((a, b) => b - a);
    }, [data]);

    const activeYear = selectedYear ?? years[0] ?? new Date().getFullYear();

    const yearData = useMemo(() => {
        if (!data) return [];
        const yearStr = String(activeYear);
        const inYear = data.data.filter((d) => d.date.startsWith(yearStr));
        const hasStart = inYear.some((d) => d.date === `${yearStr}-01-01`);
        const hasEnd = inYear.some((d) => d.date === `${yearStr}-12-31`);

        return [
            ...(hasStart ? [] : [{date: `${yearStr}-01-01`, count: 0, level: 0}]),
            ...inYear,
            ...(hasEnd ? [] : [{date: `${yearStr}-12-31`, count: 0, level: 0}]),
        ];
    }, [data, activeYear]);

    if (!data && !loading) return null;
    if (!data) return null;

    const handleYearChange = (value: string) => {
        setSelectedYear(Number(value));
        setSelectedDate(null);
        setDetails([]);
    };

    const handleDayClick = async (date: string) => {
        if (!actions?.onActivityClick) return;

        setSelectedDate(date);
        setDetailsLoading(true);
        setDetails([]);

        const result = await actions.onActivityClick({date, ...params});
        setDetails(Array.isArray(result) ? result : []);
        setDetailsLoading(false);
    };

    switch (config.displayType) {
        case 'tooltip-and-href':
            return (
                <div className="flex flex-col gap-4">
                    {years.length > 1 && (
                        <div className="flex justify-end">
                            <div className="w-32">
                                <SelectLib
                                    options={years.map((y) => ({value: String(y), label: String(y)}))}
                                    value={String(activeYear)}
                                    onChange={handleYearChange}
                                />
                            </div>
                        </div>
                    )}

                    <ActivityCalendarLib
                        data={yearData}
                        fullWidth
                        tooltips={{
                            activity: {
                                text: activity => `${activity.count} activités le ${activity.date}`,
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
                                    void handleDayClick(activity.date);
                                },
                                style: {
                                    cursor: "pointer"
                                }
                            })
                        }
                    />

                    {selectedDate && (
                        <div className="rounded-lg border border-main bg-surface-2 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-semibold text-main">
                                    Activité du {new Date(selectedDate).toLocaleDateString("fr-FR")}
                                </p>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-xs text-subtitle-accent hover:text-main transition-colors"
                                    aria-label="Fermer"
                                >
                                    ✕
                                </button>
                            </div>

                            {detailsLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <SpinnerLib/>
                                </div>
                            ) : details.length > 0 ? (
                                <div className="max-h-72 overflow-y-auto pr-1">
                                    <SummaryListCardLib
                                        items={details.map((item) => ({
                                            label: describeActivity(item),
                                            badge: {
                                                text: DOMAIN_LABELS[item.domain] ?? item.domain,
                                                variant: DOMAIN_BADGE_VARIANTS[item.domain] ?? "secondary",
                                            },
                                        }))}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-subtitle-accent">
                                    Aucune activité détaillée pour ce jour.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            );
    }
}

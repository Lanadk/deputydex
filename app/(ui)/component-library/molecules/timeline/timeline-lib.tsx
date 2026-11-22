import React from "react";

/** Une période sur un couloir (dates AAAA-MM-JJ ; `end` null = en cours, jusqu'à la fin de la frise). */
export type TimelinePeriod = {
    id: string;
    label: string;
    detail?: string | null;
    start: string;
    end: string | null;
    href?: string | null;
};

export type TimelineLane = {
    id: string;
    label: string;
    /** Couleur des périodes du couloir (ex. `var(--chart-1)`). */
    color: string;
    periods: TimelinePeriod[];
};

export type TimelineEvent = {
    date: string;
    label: string;
};

export type TimelineLibProps = {
    /** Début et fin de l'axe (AAAA-MM-JJ). */
    start: string;
    end: string;
    lanes: TimelineLane[];
    events?: TimelineEvent[];
    ariaLabel?: string;
};

const DAY_MS = 86_400_000;
/** En deçà de cette largeur (% de l'axe), une période n'affiche pas son libellé. */
const NARROW_PERIOD_PCT = 4;
const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`);

/** « 18/07/2024 » (date AAAA-MM-JJ, sans décalage de fuseau). */
export function formatTimelineDate(date: string): string {
    return new Date(toTime(date)).toLocaleDateString("fr-FR", { timeZone: "UTC" });
}

/** Position d'une date sur l'axe, en % (bornée à [0, 100]). */
export function timelinePosition(date: string, start: string, end: string): number {
    const span = Math.max(toTime(end) - toTime(start), DAY_MS);
    return Math.min(100, Math.max(0, ((toTime(date) - toTime(start)) / span) * 100));
}

/** 1ᵉʳ janvier de chaque année strictement à l'intérieur de l'axe. */
export function yearTicks(start: string, end: string): string[] {
    const ticks: string[] = [];
    for (let y = Number(start.slice(0, 4)) + 1; `${y}-01-01` <= end; y++) ticks.push(`${y}-01-01`);
    return ticks;
}

const describe = (p: TimelinePeriod) =>
    `${p.label}${p.detail ? ` (${p.detail})` : ""}, ${p.end ? `du ${formatTimelineDate(p.start)} au ${formatTimelineDate(p.end)}` : `depuis le ${formatTimelineDate(p.start)}`}`;

/**
 * Frise chronologique en couloirs parallèles, à l'échelle du temps : chaque
 * couloir aligne ses périodes sur le même axe, ce qui montre d'un coup d'œil
 * ce qui était en place à une date donnée. Les événements sont des lignes
 * verticales, reprises dans la légende. Défile horizontalement sur petit écran.
 */
export function TimelineLib({ start, end, lanes, events = [], ariaLabel = "Frise chronologique" }: TimelineLibProps) {
    const pos = (date: string) => timelinePosition(date, start, end);

    return (
        <figure className="timeline-lib" aria-label={ariaLabel}>
            <div className="timeline-lib__scroll">
                <div className="timeline-lib__canvas">
                    <div className="timeline-lib__axis" aria-hidden="true">
                        {yearTicks(start, end).map((tick) => (
                            <span key={tick} className="timeline-lib__tick" style={{ left: `${pos(tick)}%` }}>{tick.slice(0, 4)}</span>
                        ))}
                    </div>

                    <div className="timeline-lib__body">
                        {lanes.map((lane) => (
                            <div key={lane.id} className="timeline-lib__lane">
                                <div className="timeline-lib__lane-label">{lane.label}</div>
                                <ol className="timeline-lib__track" aria-label={lane.label} style={{ "--timeline-color": lane.color } as React.CSSProperties}>
                                    {lane.periods.map((p) => {
                                        const left = pos(p.start);
                                        const width = Math.max(pos(p.end ?? end) - left, 0.4);
                                        // Période trop courte pour son libellé : texte masqué (pas de « G… » tronqué),
                                        // gardé pour les lecteurs d'écran et dans l'info-bulle.
                                        const content = <span className={width < NARROW_PERIOD_PCT ? "sr-only" : "timeline-lib__period-label"}>{p.label}</span>;
                                        return (
                                            <li key={p.id} className="timeline-lib__period" style={{ left: `${left}%`, width: `${width}%` }} title={describe(p)}>
                                                {p.href
                                                    ? <a href={p.href} aria-label={describe(p)}>{content}</a>
                                                    : <span aria-label={describe(p)}>{content}</span>}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        ))}

                        <div className="timeline-lib__events" aria-hidden="true">
                            {events.map((e) => (
                                <span key={e.date} className="timeline-lib__event-line" style={{ left: `${pos(e.date)}%` }} title={`${formatTimelineDate(e.date)} : ${e.label}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {events.length > 0 && (
                <figcaption>
                    <ul className="timeline-lib__legend">
                        {events.map((e) => (
                            <li key={e.date}><span className="timeline-lib__legend-mark" aria-hidden="true" /><time dateTime={e.date}>{formatTimelineDate(e.date)}</time> : {e.label}</li>
                        ))}
                    </ul>
                </figcaption>
            )}
        </figure>
    );
}

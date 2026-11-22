import React from "react";
import { formatJourFr } from "@/app/_shared/utils/date";

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

/** Écart minimal (% de l'axe) entre deux repères d'événement sur une même rangée. */
const MARKER_GAP_PCT = 3;

/**
 * Rangée de chaque repère d'événement (positions triées) : un repère trop proche
 * du précédent passe à la rangée suivante au lieu de le chevaucher.
 */
export function eventMarkerRows(positions: number[], gap: number = MARKER_GAP_PCT): number[] {
    const lastByRow: number[] = [];
    return positions.map((p) => {
        let row = lastByRow.findIndex((last) => p - last >= gap);
        if (row === -1) row = lastByRow.length;
        lastByRow[row] = p;
        return row;
    });
}

const describe = (p: TimelinePeriod) =>
    `${p.label}${p.detail ? ` (${p.detail})` : ""}, ${p.end ? `du ${formatJourFr(p.start)} au ${formatJourFr(p.end)}` : `depuis le ${formatJourFr(p.start)}`}`;

/**
 * Frise chronologique en couloirs parallèles, à l'échelle du temps : chaque
 * couloir aligne ses périodes sur le même axe, ce qui montre d'un coup d'œil
 * ce qui était en place à une date donnée. Chaque événement est un repère
 * numéroté au-dessus de l'axe, prolongé d'une ligne verticale à travers les
 * couloirs, et repris (même numéro) dans la légende. Défile horizontalement
 * sur petit écran.
 */
export function TimelineLib({ start, end, lanes, events = [], ariaLabel = "Frise chronologique" }: TimelineLibProps) {
    const pos = (date: string) => timelinePosition(date, start, end);
    // Événements numérotés dans l'ordre chronologique : le même numéro sur la frise et dans la légende.
    const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));
    const markerRows = eventMarkerRows(sortedEvents.map((e) => pos(e.date)));
    const rowCount = markerRows.length ? Math.max(...markerRows) + 1 : 0;

    return (
        <figure className="timeline-lib" aria-label={ariaLabel}>
            <div className="timeline-lib__scroll">
                <div className="timeline-lib__canvas">
                    {sortedEvents.length > 0 && (
                        <div className="timeline-lib__markers" aria-hidden="true" style={{ "--timeline-marker-rows": rowCount } as React.CSSProperties}>
                            {sortedEvents.map((e, i) => (
                                <span
                                    key={e.date}
                                    className="timeline-lib__marker"
                                    style={{ left: `${pos(e.date)}%`, "--timeline-marker-row": markerRows[i] } as React.CSSProperties}
                                    title={`${formatJourFr(e.date)} : ${e.label}`}
                                >
                                    {i + 1}
                                </span>
                            ))}
                        </div>
                    )}

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
                            {sortedEvents.map((e) => (
                                <span key={e.date} className="timeline-lib__event-line" style={{ left: `${pos(e.date)}%` }} title={`${formatJourFr(e.date)} : ${e.label}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {sortedEvents.length > 0 && (
                <figcaption>
                    <ol className="timeline-lib__legend">
                        {sortedEvents.map((e, i) => (
                            <li key={e.date}>
                                <span className="timeline-lib__marker timeline-lib__marker--legend" aria-hidden="true">{i + 1}</span>
                                <span><time dateTime={e.date} className="timeline-lib__legend-date">{formatJourFr(e.date)}</time> {e.label}</span>
                            </li>
                        ))}
                    </ol>
                </figcaption>
            )}
        </figure>
    );
}

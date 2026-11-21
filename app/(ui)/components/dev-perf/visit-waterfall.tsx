import React from "react";
import { PageVisit } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { parseServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";
import { Ms } from "@/app/(ui)/components/dev-perf/dev-perf-ui";

/** Une ligne de cascade : libellé, barre positionnée sur la durée de la visite, durée. */
function WaterfallRow({ label, detail, startMs, durationMs, totalMs, color, failed = false }: {
    label: string;
    detail?: React.ReactNode;
    startMs: number;
    durationMs: number;
    totalMs: number;
    color: string;
    failed?: boolean;
}) {
    const left = totalMs > 0 ? (startMs / totalMs) * 100 : 0;
    const width = totalMs > 0 ? Math.max((durationMs / totalMs) * 100, 0.6) : 0;
    return (
        <div className="grid grid-cols-[minmax(0,16rem)_1fr_13rem] items-center gap-3 text-xs">
            <span className="truncate font-mono" title={label}>{label}</span>
            <div className="relative h-3 rounded bg-surface-3">
                <div
                    className="absolute inset-y-0 rounded"
                    style={{ left: `${left}%`, width: `${width}%`, background: failed ? "var(--ui-danger)" : color }}
                />
            </div>
            <span className="tabular-nums text-right text-subtitle-accent">
                <Ms ms={durationMs} />{detail ? <> · {detail}</> : null}
            </span>
        </div>
    );
}

/**
 * Cascade d'une visite : quand chaque section et chaque appel API commence et
 * finit, avec le temps SQL et le cache de chaque appel. Rouge : échec.
 */
export function VisitWaterfall({ visit }: { visit: PageVisit }) {
    return (
        <div className="flex flex-col gap-1.5">
            {visit.sections.length > 0 && (
                <span className="text-xs font-semibold uppercase tracking-wide text-subtitle-accent">Sections</span>
            )}
            {visit.sections.map((s, i) => (
                <WaterfallRow
                    key={`s-${s.sectionId}-${i}`}
                    label={s.sectionId}
                    startMs={s.startMs}
                    durationMs={s.durationMs}
                    totalMs={visit.durationMs}
                    color="var(--accent)"
                    failed={!s.ok}
                />
            ))}
            <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-subtitle-accent">Appels API</span>
            {visit.fetches.map((f, i) => {
                const timing = parseServerTiming(f.serverTiming);
                const detail = timing ? <>SQL <Ms ms={timing.sqlMs} />{timing.cacheHit ? " · cache" : ""}</> : undefined;
                return (
                    <WaterfallRow
                        key={`f-${f.url}-${i}`}
                        label={f.url}
                        detail={detail}
                        startMs={f.startMs}
                        durationMs={f.durationMs}
                        totalMs={visit.durationMs}
                        // Couleur neutre : le rouge est réservé aux échecs.
                        color="var(--subtitle-accent)"
                        failed={f.status >= 400}
                    />
                );
            })}
        </div>
    );
}

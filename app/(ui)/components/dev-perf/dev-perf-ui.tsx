import React from "react";
import { DurationStats, VisitStats } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { Delta as DeltaValue, MIN_COMPARABLE_SAMPLES } from "@/app/_shared/dev-perf/dev-perf.baseline";
import { deltaColor, durationColor } from "@/app/(ui)/_shared/adapter/duration.adapter";

/*
 * Briques d'affichage partagées par les onglets de /dev/perf : formats,
 * valeurs colorées, titres et classes des tableaux.
 */

// ── Formats ───────────────────────────────────────────────────────────────

/** Durée lisible, au dixième de ms sous 10 ms (une réponse du cache mesure souvent < 1 ms). */
export function formatMs(ms: number): string {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2).replace(".", ",")} s`;
    if (ms < 10) return `${ms.toFixed(1).replace(".", ",")} ms`;
    return `${Math.round(ms)} ms`;
}

export const formatAvgP95 = (s: DurationStats) => (s.count ? `${formatMs(s.avgMs)} / ${formatMs(s.p95Ms)}` : "—");

/** Poids lisible : « 850 o », « 12,4 Ko », « 1,2 Mo ». */
export function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1).replace(".", ",")} Ko`;
    return `${Math.round(bytes)} o`;
}

/**
 * Facteur d'accélération du cache : « ×36 ». Au-delà de ×100 (réponse du cache
 * sous la milliseconde), le chiffre exact n'apporte plus rien : « ×100+ ».
 */
export function formatSpeedup(factor: number | null): string {
    if (factor === null) return "—";
    if (factor >= 100) return "×100+";
    return `×${factor >= 10 ? Math.round(factor) : factor.toFixed(1).replace(".", ",")}`;
}

/** « −42 % », « +8 % » ; « — » sans comparaison possible. */
export function formatPct(pct: number | null): string {
    if (pct === null) return "—";
    const rounded = Math.round(pct);
    return `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${Math.abs(rounded)} %`;
}

// ── Valeurs colorées ──────────────────────────────────────────────────────

/** Durée colorée selon sa lenteur : orange de 100 à 200 ms, rouge au-delà (voir duration.adapter). */
export function Ms({ ms }: { ms: number }) {
    return <span style={{ color: durationColor(ms) }}>{formatMs(ms)}</span>;
}

/** « moy. / p95 », chaque valeur colorée ; « — » sans mesure. */
export function AvgP95({ stats }: { stats: DurationStats }) {
    if (!stats.count) return <>—</>;
    return <><Ms ms={stats.avgMs} /> / <Ms ms={stats.p95Ms} /></>;
}

/** « 412 ms → 108 ms (−74 %) », durées colorées. */
export function Evolution({ first, last }: { first: VisitStats; last: VisitStats }) {
    const pct = first.durationMs > 0 ? ((last.durationMs - first.durationMs) / first.durationMs) * 100 : 0;
    return <><Ms ms={first.durationMs} /> → <Ms ms={last.durationMs} /> ({formatPct(pct)})</>;
}

/** « +41 ms », « −0,3 ms » : écart en ms (référence sous 1 ms, où un % n'a pas de sens). */
export function formatDeltaMs(ms: number): string {
    const sign = ms > 0 ? "+" : ms < 0 ? "−" : "";
    return `${sign}${formatMs(Math.abs(ms))}`;
}

/**
 * Écart à la référence : en % (en ms si la référence est sous 1 ms) ; vert si
 * plus rapide, rouge si plus lent, au-delà du bruit ; grisé et marqué « ? »
 * quand il repose sur trop peu de mesures.
 */
export function Delta({ delta }: { delta: DeltaValue | null }) {
    if (!delta) return <>—</>;
    const text = delta.pct === null ? formatDeltaMs(delta.ms) : formatPct(delta.pct);
    const uncertain = delta.trend === "uncertain";
    return (
        <span
            style={{ color: deltaColor(delta.trend) }}
            title={uncertain ? `Trop peu de mesures (moins de ${MIN_COMPARABLE_SAMPLES} d'un côté) : écart indicatif.` : undefined}
        >
            {text}{uncertain && " ?"}
        </span>
    );
}

// ── Mise en page ──────────────────────────────────────────────────────────

export function SectionTitle({ title, hint }: { title: string; hint: string }) {
    return (
        <div className="mb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-subtitle-accent">{hint}</p>
        </div>
    );
}

export const card = "rounded-lg border border-main bg-card p-4";
export const th = "py-2 pr-4 text-left font-medium text-subtitle-accent whitespace-nowrap";
export const thNum = "py-2 pr-4 text-right font-medium text-subtitle-accent whitespace-nowrap";
export const td = "py-1.5 pr-4 border-t border-main";
export const tdNum = `${td} text-right tabular-nums whitespace-nowrap`;

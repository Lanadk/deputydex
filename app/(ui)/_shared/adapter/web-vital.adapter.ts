import { WebVitalName } from "@/app/_shared/dev-perf/dev-perf.types";

/**
 * Seuils officiels des Web Vitals (https://web.dev/articles/vitals) :
 * « bon » jusqu'à `good`, « à améliorer » jusqu'à `poor`, « mauvais » au-delà.
 * Valeurs en ms, sauf CLS (score sans unité).
 */
export const WEB_VITAL_THRESHOLDS: Record<WebVitalName, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    FCP: { good: 1800, poor: 3000 },
    INP: { good: 200, poor: 500 },
    TTFB: { good: 800, poor: 1800 },
    CLS: { good: 0.1, poor: 0.25 },
};

/** Couleur d'un Web Vital : vert (bon), orange (à améliorer), rouge (mauvais). */
export function webVitalColor(name: WebVitalName, value: number): string {
    const { good, poor } = WEB_VITAL_THRESHOLDS[name];
    if (value <= good) return "var(--ui-success)";
    if (value <= poor) return "var(--ui-warning)";
    return "var(--ui-danger)";
}

/** Valeur lisible : « 1,2 s », « 340 ms », ou le score CLS (« 0,04 »). */
export function formatWebVital(name: WebVitalName, value: number): string {
    if (name === "CLS") return value.toFixed(2).replace(".", ",");
    return value >= 1000 ? `${(value / 1000).toFixed(1).replace(".", ",")} s` : `${Math.round(value)} ms`;
}

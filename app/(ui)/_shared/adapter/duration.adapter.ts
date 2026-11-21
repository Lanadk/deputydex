import { DeltaTrend } from "@/app/_shared/dev-perf/dev-perf.baseline";

/**
 * Couleur d'une durée (ms) selon sa lenteur, pour la lire d'un coup d'œil
 * (outil de perf /dev/perf) :
 * - moins de 100 ms : couleur du texte (rien à signaler) ;
 * - de 100 à 200 ms : orange (lent) ;
 * - au-delà de 200 ms : rouge (très lent).
 */
export const DURATION_SLOW_MS = 100;
export const DURATION_VERY_SLOW_MS = 200;

export function durationColor(ms: number): string | undefined {
    if (ms > DURATION_VERY_SLOW_MS) return "var(--ui-danger)";
    if (ms >= DURATION_SLOW_MS) return "var(--ui-warning)";
    return undefined;
}

/**
 * Seuils d'un rendu de composant, plus serrés que ceux d'un appel d'API : au-delà
 * de 16 ms, le rendu dépasse une image à 60 images/s (saccade possible) ; au-delà
 * de 50 ms, c'est une « tâche longue » qui bloque les interactions.
 */
export const RENDER_FRAME_MS = 16;
export const RENDER_LONG_TASK_MS = 50;

export function renderDurationColor(ms: number): string | undefined {
    if (ms >= RENDER_LONG_TASK_MS) return "var(--ui-danger)";
    if (ms >= RENDER_FRAME_MS) return "var(--ui-warning)";
    return undefined;
}

/**
 * Couleur d'un écart à la référence (règle du bruit : `compareDurations`) :
 * vert si plus rapide, rouge si plus lent ; rien dans le bruit ; grisé si trop peu de mesures.
 */
export function deltaColor(trend: DeltaTrend | undefined): string | undefined {
    switch (trend) {
        case "faster":
            return "var(--ui-success)";
        case "slower":
            return "var(--ui-danger)";
        case "uncertain":
            return "var(--subtitle-accent)";
        default:
            return undefined;
    }
}

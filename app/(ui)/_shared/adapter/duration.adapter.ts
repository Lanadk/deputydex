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

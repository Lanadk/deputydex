/** 1 décimale si besoin, sinon un entier — évite les "46.00%" moches. */
export function formatNumber(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatPct(value: number): string {
    return `${formatNumber(value)}%`;
}

/**
 * "au-dessus de" / "en-dessous de" / "à peu près comme" — la brique commune
 * à tous les insights qui comparent une valeur courante à une référence.
 */
export function describeDirection(current: number, reference: number): string {
    if (Math.abs(current - reference) < 0.05) return "à peu près comme";
    return current > reference ? "au-dessus de" : "en-dessous de";
}

/** % que représente `part` dans `part + rest` (ex: femmes / (hommes + femmes)) — null si le total est nul. */
export function ratioPct(part: number, rest: number): number | null {
    const total = part + rest;
    if (total <= 0) return null;
    return (part / total) * 100;
}

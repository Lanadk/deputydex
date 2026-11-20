export function toISODateOnly(d: Date | null | undefined): string | null {
    if (!d) return null;
    // yyyy-mm-dd
    return d.toISOString().slice(0, 10);
}
/**
 * Formate en jj/mm/aaaa une date ISO « jour seul » de l'open data (minuit UTC),
 * en UTC pour qu'elle ne glisse pas d'un jour selon le fuseau du lecteur.
 */
export function formatDateOnlyFr(iso: string | null | undefined): string | null {
    return iso ? new Date(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" }) : null;
}

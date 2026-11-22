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
    return iso ? formatJourFr(iso) : null;
}

/** Minuit UTC du jour d'une date ISO (« 2024-07-18 » ou « 2024-07-18T00:00:00.000Z »). */
const jourUtc = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

const JOUR_LONG_FR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** « 18/07/2024 » : un jour (date ISO), sans glissement selon le fuseau du lecteur. */
export function formatJourFr(iso: string): string {
    return jourUtc(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" });
}

/** « 18 juillet 2024 » : un jour (date ISO), sans glissement selon le fuseau du lecteur. */
export function formatJourLongFr(iso: string): string {
    return JOUR_LONG_FR.format(jourUtc(iso));
}

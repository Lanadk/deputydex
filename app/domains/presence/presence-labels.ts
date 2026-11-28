/**
 * Libellés des statistiques de présence. Les graphiques multi-séries trient
 * leurs libellés par ordre lexicographique (`toMultiSeriesDataset`) : les jours
 * de la semaine sont donc préfixés par leur numéro ISO pour rester dans
 * l'ordre lundi → dimanche.
 */

const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

/** 1 (ISO, lundi) → « 1 · Lundi » ; 7 → « 7 · Dimanche ». */
export function jourSemaineLabel(isoDow: number): string {
    return `${isoDow} · ${JOURS_SEMAINE[isoDow - 1] ?? "?"}`;
}

/** « 17ᵉ législature » */
export function legislatureLabel(legislature: number): string {
    return `${legislature}ᵉ législature`;
}

/**
 * Libellé d'une période annuelle, préfixé par la législature pour qu'une même
 * année civile (2024 : fin de la 16ᵉ et début de la 17ᵉ) ou un même rang de
 * mandat n'apparaisse pas deux fois sous le même libellé : « 17ᵉ · 2025-2026 »,
 * « 17ᵉ · année 1 ».
 */
export function periodeLabel(legislature: number, periode: string, type: "civile" | "parlementaire" | "mandat"): string {
    return `${legislature}ᵉ · ${type === "mandat" ? `année ${periode}` : periode}`;
}

/** Date → « 2025-10 » (mois) */
export function moisLabel(mois: Date): string {
    return mois.toISOString().slice(0, 7);
}

/** Date → « 2025-10-14 » (jour) */
export function jourLabel(jour: Date): string {
    return jour.toISOString().slice(0, 10);
}

const nombre = (n: number) => n.toLocaleString("fr-FR");
const pluriel = (n: number, singulier: string, plurielForme: string) => (n > 1 ? plurielForme : singulier);

const JOUR_MOIS = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const JOUR_MOIS_ANNEE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const jourUtc = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

/** « 21 oct. → 19 nov. 2026 » (dates AAAA-MM-JJ). */
export function periodeCourte(periode: { debut: string; fin: string }): string {
    return `${JOUR_MOIS.format(jourUtc(periode.debut))} → ${JOUR_MOIS_ANNEE.format(jourUtc(periode.fin))}`;
}

/** « 18 nov. 2026 » (date ISO). */
export function jourCourt(iso: string): string {
    return JOUR_MOIS_ANNEE.format(jourUtc(iso));
}

/**
 * Résultat d'un scrutin serré : « Rejeté à égalité parfaite » (une égalité
 * fait rejeter), « Adopté à 1 voix près ». « voix » est invariable.
 */
export function phraseEcart(isAdopte: boolean, ecart: number): string {
    const resultat = isAdopte ? "Adopté" : "Rejeté";
    return ecart === 0 ? `${resultat} à égalité parfaite` : `${resultat} à ${nombre(ecart)} voix près`;
}

/** Unité sous le grand chiffre de l'assidu : « scrutins sur 1 134 ». */
export function uniteAssidu(votes: number, scrutins: number): string {
    return `${pluriel(votes, "scrutin", "scrutins")} sur ${nombre(scrutins)}`;
}

/** Unité sous le grand chiffre du rebelle : « votes contre son groupe ». */
export function uniteRebelle(votes: number): string {
    return `${pluriel(votes, "vote", "votes")} contre son groupe`;
}

/** Unité sous le grand chiffre des amendements : « amendements déposés ». */
export function uniteAmendements(amendements: number): string {
    return pluriel(amendements, "amendement déposé", "amendements déposés");
}

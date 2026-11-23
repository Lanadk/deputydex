import { formatJourCourtFr, formatJourMoisFr } from "@/app/_shared/utils/date";

/** Nombre de derniers scrutins importants montrés dans l'actu de l'accueil (le premier en grand). */
export const HOME_DERNIERS_VOTES = 3;

const nombre = (n: number) => n.toLocaleString("fr-FR");
const pluriel = (n: number, singulier: string, plurielForme: string) => (n > 1 ? plurielForme : singulier);

/** « 21 oct. → 19 nov. 2026 » (dates AAAA-MM-JJ). */
export function periodeCourte(periode: { debut: string; fin: string }): string {
    return `${formatJourMoisFr(periode.debut)} → ${formatJourCourtFr(periode.fin)}`;
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

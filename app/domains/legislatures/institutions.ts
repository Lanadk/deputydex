/*
 * Règles métier de l'organisation institutionnelle autour des législatures :
 * périodes, gouvernements, rangs gouvernementaux, Bureau de l'Assemblée.
 * Dates au format AAAA-MM-JJ : l'ordre alphabétique est l'ordre chronologique.
 */

/** Une période [debut, fin] (fin null = en cours) chevauche-t-elle [debut, fin] ? */
export function chevauche(debut: string, fin: string | null, autreDebut: string, autreFin: string): boolean {
    return debut <= autreFin && (fin === null || fin >= autreDebut);
}

/** La période [debut, fin] (fin null = en cours) contient-elle `date` ? */
export function contient(debut: string, fin: string | null, date: string): boolean {
    return debut <= date && (fin === null || fin >= date);
}

/** Nombre de jours entre deux dates AAAA-MM-JJ. */
export function joursEntre(debut: string, fin: string): number {
    return Math.round((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${debut}T00:00:00Z`)) / 86_400_000);
}

const CHIFFRES_ROMAINS = ["", "I", "II", "III", "IV", "V", "VI"];

/**
 * Nomme les gouvernements d'après leur Premier ministre : « Gouvernement Borne ».
 * Un Premier ministre qui en forme plusieurs d'affilée les voit numérotés
 * (« Gouvernement Lecornu I », « Gouvernement Lecornu II »).
 * `mandats` : un mandat de Premier ministre par gouvernement, dans l'ordre chronologique.
 */
export function nommerGouvernements<T extends { acteur_uid: string; nom: string }>(mandats: T[]): (T & { libelle: string })[] {
    return mandats.map((m, i) => {
        // Série de gouvernements consécutifs du même Premier ministre autour de celui-ci.
        let debutSerie = i;
        while (debutSerie > 0 && mandats[debutSerie - 1].acteur_uid === m.acteur_uid) debutSerie--;
        let finSerie = i;
        while (finSerie < mandats.length - 1 && mandats[finSerie + 1].acteur_uid === m.acteur_uid) finSerie++;
        const numero = finSerie > debutSerie ? ` ${CHIFFRES_ROMAINS[i - debutSerie + 1] ?? i - debutSerie + 1}` : "";
        return { ...m, libelle: `Gouvernement ${m.nom}${numero}` };
    });
}

/** Rangs gouvernementaux, dans l'ordre protocolaire. Le garde des Sceaux est un ministre. */
export const RANGS_GOUVERNEMENT = [
    { rang: "ministre-etat", libelle: "Ministres d'État", qualites: ["Ministre d'État"] },
    { rang: "ministre", libelle: "Ministres", qualites: ["Ministre", "Garde des sceaux"] },
    { rang: "ministre-delegue", libelle: "Ministres délégués", qualites: ["Ministre délégué"] },
    { rang: "secretaire-etat", libelle: "Secrétaires d'État", qualites: ["Secrétaire d'État"] },
] as const;

export const PREMIER_MINISTRE = "Premier ministre";

/** Parlementaires en mission auprès du Gouvernement : pas membres du gouvernement. */
export const EN_MISSION = "en mission";

/** Fonctions du Bureau de l'Assemblée, dans l'ordre ; les fonctions « d'âge » (séance d'installation) n'en font pas partie. */
export const FONCTIONS_BUREAU = {
    president: "Président",
    vicePresident: "Vice-Président",
    questeur: "Questeur",
    secretaire: "Secrétaire",
} as const;

/** Ordinal d'une législature : « 17ᵉ législature ». */
export function libelleLegislature(numero: number): string {
    return `${numero}${numero === 1 ? "ʳᵉ" : "ᵉ"} législature`;
}

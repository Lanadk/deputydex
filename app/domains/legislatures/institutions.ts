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

/** Ouverture de la session ordinaire : le premier jour ouvrable d'octobre (art. 28 de la Constitution), ramené au 1er. */
const OUVERTURE_SESSION = "-10-01";

/**
 * Une Assemblée installée peu avant octobre (élections générales de juin-juillet)
 * ne siège que quelques semaines en session extraordinaire : cette période est
 * rattachée à la session ordinaire qui suit plutôt que de former un onglet à part.
 */
const RATTACHEMENT_INSTALLATION_JOURS = 120;

/**
 * Le Bureau (hors président) et les présidences de commission sont renouvelés
 * dans les premiers jours de la session : un mandat terminé dans ce délai après
 * l'ouverture appartient à la session précédente, pas à celle qui commence.
 */
export const DELAI_RENOUVELLEMENT_JOURS = 7;

/** Une session de l'Assemblée au sein d'une législature (`fin` null : en cours). */
export type SessionPeriode = {
    /** Année d'ouverture : 2025 pour la session 2025-2026. */
    annee: number;
    debut: string;
    fin: string | null;
    /** Commence par un renouvellement (ouverture d'octobre), pas par l'installation de l'Assemblée. */
    renouvellement: boolean;
};

const veille = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);

/**
 * Sessions d'une législature, dans l'ordre chronologique : la première commence
 * à l'installation de l'Assemblée, les suivantes à chaque ouverture d'octobre ;
 * la dernière finit avec la législature (null si elle est en cours).
 */
export function sessionsDeLaLegislature(debut: string, fin: string | null, aujourdhui: string): SessionPeriode[] {
    const borne = fin ?? aujourdhui;
    const anneeDebut = Number(debut.slice(0, 4));
    // Année de la session dans laquelle tombe l'installation.
    let annee = debut >= `${anneeDebut}${OUVERTURE_SESSION}` ? anneeDebut : anneeDebut - 1;
    const ouvertures: string[] = [];
    for (let y = annee + 1; `${y}${OUVERTURE_SESSION}` <= borne; y++) ouvertures.push(`${y}${OUVERTURE_SESSION}`);
    if (ouvertures.length > 0 && joursEntre(debut, ouvertures[0]) <= RATTACHEMENT_INSTALLATION_JOURS) {
        ouvertures.shift();
        annee += 1;
    }
    const debuts = [debut, ...ouvertures];
    return debuts.map((d, i) => ({
        annee: annee + i,
        debut: d,
        fin: i < debuts.length - 1 ? veille(debuts[i + 1]) : fin,
        renouvellement: i > 0,
    }));
}

/** « Session 2025-2026 ». */
export function libelleSession(annee: number): string {
    return `Session ${annee}-${annee + 1}`;
}

/**
 * Un mandat (fonction à l'Assemblée) a-t-il été exercé pendant la session ?
 * Un mandat clos par le renouvellement d'ouverture (cf. DELAI_RENOUVELLEMENT_JOURS)
 * n'appartient qu'à la session précédente.
 */
export function exerceePendantLaSession(
    mandat: { debut: string; fin: string | null },
    session: SessionPeriode,
    aujourdhui: string
): boolean {
    if (mandat.debut > (session.fin ?? aujourdhui)) return false;
    if (mandat.fin === null) return true;
    if (mandat.fin < session.debut) return false;
    return !session.renouvellement || joursEntre(session.debut, mandat.fin) >= DELAI_RENOUVELLEMENT_JOURS;
}

/** Type d'événement institutionnel (référentiel `ref_evenements_institutionnels`) d'une dissolution. */
export const EVENEMENT_DISSOLUTION = "dissolution";

/**
 * Une législature close l'a-t-elle été par une dissolution ? Oui si une
 * dissolution du référentiel tombe dans sa période (le décret de dissolution
 * est daté du dernier jour de la législature).
 */
export function finParDissolution(
    periode: { debut: string; fin: string | null },
    evenements: { date: string; type: string }[]
): boolean {
    const fin = periode.fin;
    return fin !== null && evenements.some((e) => e.type === EVENEMENT_DISSOLUTION && contient(periode.debut, fin, e.date));
}

/** « 1er mandat », « 2e mandat » (mandats présidentiels). */
export function libelleMandat(numero: number): string {
    return `${numero}${numero === 1 ? "er" : "e"} mandat`;
}

/** Ordinal d'une législature : « 17ᵉ législature ». */
export function libelleLegislature(numero: number): string {
    return `${numero}${numero === 1 ? "ʳᵉ" : "ᵉ"} législature`;
}

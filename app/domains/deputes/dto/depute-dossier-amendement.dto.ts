/** Amendement déposé par un député sur un dossier législatif. */
export type DeputeDossierAmendementDTO = {
    uid: string;
    numero: string | null;
    /** Division visée (ex. "Article PREMIER", "Après l'article 3"). */
    division: string | null;
    /** Sort de l'amendement s'il a été examiné, sinon son état (ex. "Irrecevable"). */
    statut: string | null;
    isAdopte: boolean;
    dateDepot: string | null;
    /** Exposé sommaire en texte brut. */
    exposeSommaire: string | null;
    lienAN: string;
};

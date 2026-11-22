/** Présidence de l'Assemblée nationale d'une législature : en cours, ou la dernière si la législature est close. */
export type PresidenceAssembleeDTO = {
    /** Identifiant du député (fiche `/deputes/<uid>`, carte de l'hémicycle). */
    uid: string;
    nom: string;
    depuis: string;
    /** Fin du mandat ; null s'il est en cours. */
    jusqua: string | null;
};

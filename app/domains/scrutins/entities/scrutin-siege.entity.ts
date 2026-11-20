/**
 * Député en mandat le jour d'un scrutin, avec son siège dans l'hémicycle
 * (`mandats.mandature_place_hemicycle`) et son vote s'il a pris part au scrutin.
 */
export type ScrutinSiegeEntity = {
    /** Numéro de siège AN (1 → 650) ; les numéros élevés sont à gauche */
    place: number;
    depute_uid: string;
    prenom: string | null;
    nom: string | null;
    groupe_code: string | null;
    groupe_label: string | null;
    /** null : le député n'a pas pris part au vote (absent) */
    position: string | null;
};

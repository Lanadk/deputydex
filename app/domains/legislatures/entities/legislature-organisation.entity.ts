/*
 * Lignes lues par le repository de l'organisation des législatures. Dates au
 * format AAAA-MM-JJ (formatées en SQL) : pas de conversion de fuseau horaire.
 */

export type LegislaturePeriodeRow = {
    number: number;
    debut: string;
    fin: string | null;
};

/** Un mandat de Premier ministre (= un gouvernement). */
export type PremierMinistreRow = {
    acteur_uid: string;
    prenom: string;
    nom: string;
    debut: string;
    fin: string | null;
};

/** Un mandat de président de l'Assemblée nationale. */
export type PresidentAssembleeRow = {
    legislature: number;
    acteur_uid: string;
    prenom: string;
    nom: string;
    debut: string;
    fin: string | null;
};

/** Une nomination au gouvernement (hors parlementaires « en mission »). */
export type MembreGouvernementRow = {
    acteur_uid: string;
    prenom: string;
    nom: string;
    code_qualite: string;
    lib_qualite: string;
    debut: string;
    fin: string | null;
    /** A été député : sa fiche existe sur le site. */
    est_depute: boolean;
};

/** Une fonction à l'Assemblée en place à la date de référence (Bureau, présidences de groupe et de commission). */
export type FonctionAssembleeRow = {
    acteur_uid: string;
    prenom: string;
    nom: string;
    type_organe: "BUREAU" | "GP" | "COMPER";
    code_qualite: string;
    organe_uid: string;
    groupe_code: string | null;
    groupe_libelle: string | null;
};

export type LegislatureChiffresRow = {
    scrutins: number;
    deputes_ayant_siege: number;
};

/** Députés entrés en cours de législature, par cause (remplacement, élection partielle…). */
export type EntreeEnCoursRow = {
    cause: string;
    nombre: number;
};

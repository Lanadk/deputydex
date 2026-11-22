/*
 * Lignes lues par le repository de l'organisation des législatures. Dates au
 * format AAAA-MM-JJ (formatées en SQL) : pas de conversion de fuseau horaire.
 */

/**
 * Photo d'une personne : celle de député si elle existe, sinon un portrait du
 * référentiel `ref_portraits`, dont auteur et licence sont à créditer.
 */
export type PhotoRow = {
    photo_path: string | null;
    /** Renseignés seulement pour un portrait du référentiel (pas pour une photo de député). */
    photo_auteur: string | null;
    photo_licence: string | null;
    photo_licence_url: string | null;
};

/** Un mandat présidentiel (référentiel `ref_mandats_presidentiels`), avec son portrait. */
export type MandatPresidentielRow = PhotoRow & {
    president: string;
    mandat_numero: number;
    debut: string;
    fin: string | null;
};

/** Un événement institutionnel (référentiel `ref_evenements_institutionnels`). */
export type EvenementInstitutionnelRow = {
    date: string;
    type: string;
    libelle: string;
};

/** Définition d'une fonction institutionnelle (référentiel `ref_fonctions_definitions`). */
export type FonctionDefinitionRow = {
    slug: string;
    libelle: string;
    definition: string;
    source: string | null;
};

export type LegislaturePeriodeRow = {
    number: number;
    debut: string;
    fin: string | null;
};

/** Un mandat de Premier ministre (= un gouvernement). */
export type PremierMinistreRow = PhotoRow & {
    acteur_uid: string;
    prenom: string;
    nom: string;
    debut: string;
    fin: string | null;
    /** Groupe politique de la personne à la date utile, s'il s'agit d'un député. */
    appartenance_code: string | null;
    appartenance_libelle: string | null;
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
export type MembreGouvernementRow = PhotoRow & {
    acteur_uid: string;
    prenom: string;
    nom: string;
    code_qualite: string;
    lib_qualite: string;
    debut: string;
    fin: string | null;
    /** A été député : sa fiche existe sur le site. */
    est_depute: boolean;
    /** Groupe politique de la personne à la date utile, s'il s'agit d'un député. */
    appartenance_code: string | null;
    appartenance_libelle: string | null;
};

/** Un mandat de fonction à l'Assemblée pendant la législature (Bureau, présidences de groupe et de commission). */
export type FonctionAssembleeRow = PhotoRow & {
    acteur_uid: string;
    prenom: string;
    nom: string;
    type_organe: "BUREAU" | "GP" | "COMPER";
    code_qualite: string;
    organe_uid: string;
    debut: string;
    fin: string | null;
    groupe_code: string | null;
    groupe_libelle: string | null;
    /** Groupe politique de la personne à la date utile, s'il s'agit d'un député. */
    appartenance_code: string | null;
    appartenance_libelle: string | null;
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

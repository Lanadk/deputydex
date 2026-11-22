/** Crédit d'un portrait tiers (référentiel), à afficher avec la photo. */
export type PhotoCreditDTO = {
    auteur: string;
    licence: string;
    licenceUrl: string | null;
};

/** Une personne et sa fonction ; `href` : sa fiche député, quand elle existe. */
export type PersonneFonctionDTO = {
    uid: string;
    nom: string;
    fonction: string;
    href: string | null;
    photoUrl: string | null;
    /** Null pour une photo de député (pas de crédit à afficher). */
    photoCredit: PhotoCreditDTO | null;
    /** Groupe politique de la personne (députés et anciens députés), à la date utile. */
    groupe: { code: string; libelle: string } | null;
};

export type MembreGouvernementDTO = PersonneFonctionDTO & {
    /** Date de départ, si la personne a quitté le gouvernement avant sa fin. */
    jusqua: string | null;
};

export type RangGouvernementDTO = {
    rang: string;
    libelle: string;
    membres: MembreGouvernementDTO[];
};

export type GouvernementDTO = {
    id: string;
    libelle: string;
    premierMinistre: PersonneFonctionDTO;
    debut: string;
    fin: string | null;
    rangs: RangGouvernementDTO[];
};

export type PresidentGroupeDTO = PersonneFonctionDTO & {
    groupeCode: string | null;
    groupeLibelle: string | null;
};

export type PresidentCommissionDTO = PersonneFonctionDTO & {
    commission: string;
};

export type AssembleeOrganisationDTO = {
    president: PersonneFonctionDTO | null;
    vicePresidents: PersonneFonctionDTO[];
    questeurs: PersonneFonctionDTO[];
    secretaires: PersonneFonctionDTO[];
    presidentsGroupe: PresidentGroupeDTO[];
    presidentsCommission: PresidentCommissionDTO[];
};

/**
 * Organisation institutionnelle d'une législature : exécutif (Présidence,
 * gouvernements successifs) et Assemblée (Bureau, présidences de groupe et de
 * commission), en place à la date de référence (fin de la législature, ou aujourd'hui).
 */
export type LegislatureOrganisationDTO = {
    legislature: number;
    dateReference: string;
    presidence: {
        president: string;
        mandat: string;
        depuis: string;
        photoUrl: string | null;
        photoCredit: PhotoCreditDTO | null;
    } | null;
    gouvernements: GouvernementDTO[];
    assemblee: AssembleeOrganisationDTO;
};

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

export type FonctionAssembleeDTO = PersonneFonctionDTO & {
    /** Date de départ, si la personne a quitté la fonction avant la fin de la session. */
    jusqua: string | null;
};

export type PresidentGroupeDTO = FonctionAssembleeDTO & {
    groupeCode: string | null;
    groupeLibelle: string | null;
};

export type PresidentCommissionDTO = FonctionAssembleeDTO & {
    commission: string;
};

export type AssembleeOrganisationDTO = {
    /** Le plus récent de la session, s'il y en a eu plusieurs. */
    president: FonctionAssembleeDTO | null;
    vicePresidents: FonctionAssembleeDTO[];
    questeurs: FonctionAssembleeDTO[];
    secretaires: FonctionAssembleeDTO[];
    presidentsGroupe: PresidentGroupeDTO[];
    presidentsCommission: PresidentCommissionDTO[];
};

/** Une session de l'Assemblée (octobre → septembre) et ceux qui y ont exercé une fonction. */
export type SessionAssembleeDTO = AssembleeOrganisationDTO & {
    id: string;
    libelle: string;
    debut: string;
    fin: string | null;
};

/**
 * Organisation institutionnelle d'une législature : exécutif (Présidence,
 * gouvernements successifs) et Assemblée (Bureau, présidences de groupe et de
 * commission, par session). Présidence de la République : celle en place à la
 * date de référence (fin de la législature, ou aujourd'hui).
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
    /** Sessions de l'Assemblée, de la plus récente à la plus ancienne. */
    sessions: SessionAssembleeDTO[];
    /**
     * Définitions des fonctions, par clé (`assemblee-questeur`, `ministre-delegue`…).
     * Vide si le référentiel n'a pas pu être lu : la page s'affiche sans elles.
     */
    definitions: Record<string, FonctionDefinitionDTO>;
};

/** Définition courte d'une fonction institutionnelle, et son texte de référence. */
export type FonctionDefinitionDTO = {
    libelle: string;
    definition: string;
    source: string | null;
};

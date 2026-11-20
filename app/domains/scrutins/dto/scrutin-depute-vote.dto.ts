/** Vote nominatif d'un député sur un scrutin. */
export type ScrutinDeputeVoteDTO = {
    deputeUid: string;
    /** "Prénom Nom" */
    nomComplet: string;
    /** Nom de famille, pour le tri */
    nom: string;
    groupeCode: string | null;
    groupeLabel: string | null;
    /** Position brute ("pour", "contre", "abstention", "non_votant") */
    position: string;
    positionLabel: string;
    groupePosition: string | null;
    groupePositionLabel: string | null;
    /** Position exprimée différente de la position majoritaire de son groupe */
    isRebelle: boolean;
    /** Vote exprimé par délégation */
    parDelegation: boolean;
};

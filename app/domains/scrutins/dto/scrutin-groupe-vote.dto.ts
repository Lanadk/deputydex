/** Décompte d'un groupe sur un scrutin et sa position majoritaire. */
export type ScrutinGroupeVoteDTO = {
    groupeCode: string;
    groupeLabel: string;
    nombreMembres: number | null;
    pour: number;
    contre: number;
    abstentions: number;
    nonVotants: number;
    /** Position brute ("pour", "contre", "abstention"), null si le groupe n'en a pas */
    positionMajoritaire: string | null;
    positionMajoritaireLabel: string | null;
};

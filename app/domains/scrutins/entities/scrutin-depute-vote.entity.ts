/** Vote d'un député sur un scrutin (`votes_deputes`), avec le groupe auquel il appartenait ce jour-là. */
export type ScrutinDeputeVoteEntity = {
    depute_uid: string;
    prenom: string | null;
    nom: string | null;
    groupe_code: string | null;
    groupe_label: string | null;
    position: string;
    /** Position majoritaire du groupe du député sur ce scrutin */
    groupe_position: string | null;
    par_delegation: boolean | null;
};

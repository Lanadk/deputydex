export interface GroupeFeminisationRowDTO {
    groupeCode: string;
    groupeLabel: string;
    nbHommes: number;
    nbFemmes: number;
    nbTotal: number;
    /** Arrondi à 1 décimale */
    pctFemmes: number;
    /** Femmes ayant rejoint le groupe pendant la législature (hors composition du jour de constitution) */
    femmesArrivees: number;
    /** Femmes ayant quitté le groupe pendant la législature (tous motifs confondus) */
    femmesParties: number;
}

export interface GroupesFeminisationDTO {
    /** Trié par pctFemmes décroissant */
    groupes: GroupeFeminisationRowDTO[];
    plusFeminise: GroupeFeminisationRowDTO | null;
    moinsFeminise: GroupeFeminisationRowDTO | null;
    /** null si aucun groupe n'a intégré de femme cette législature */
    plusDeFemmesIntegrees: GroupeFeminisationRowDTO | null;
    /** null si aucun groupe n'a perdu de femme cette législature */
    plusDeFemmesParties: GroupeFeminisationRowDTO | null;
}

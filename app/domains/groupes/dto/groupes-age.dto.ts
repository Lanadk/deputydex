export interface GroupeAgeRowDTO {
    groupeCode: string;
    groupeLabel: string;
    /** Arrondi à 1 décimale */
    averageAge: number;
}

export interface GroupesAgeDTO {
    /** Trié par averageAge croissant */
    groupes: GroupeAgeRowDTO[];
    plusJeune: GroupeAgeRowDTO | null;
    plusAge: GroupeAgeRowDTO | null;
}

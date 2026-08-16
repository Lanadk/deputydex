export interface DeputeAgeDTO {
    deputeUid: string;
    age: number;
}

export interface DeputesAgeExtremesDTO {
    plusJeune: DeputeAgeDTO | null;
    /** null si un seul député a un âge connu cette législature (même personne que plusJeune) */
    plusAge: DeputeAgeDTO | null;
}

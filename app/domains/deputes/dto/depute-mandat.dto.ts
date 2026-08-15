export type DeputeMandatDTO = {
    uid: string;
    typeOrgane: string;
    libQualite: string;
    dateDebut: string;
    dateFin: string | null;
    organeUid: string;
    legislature: number;
    dureeAns: number | null;
};

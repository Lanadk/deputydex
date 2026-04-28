export type DeputeIdentityDTO = {
    uid: string;
    prenom: string | null;
    nom: string | null;
    civilite: string | null;
    dateNaissance: string | null;
    age: number | null;
    professionLibelle: string | null;
    professionCategorie: string | null;
    professionFamille: string | null;
    photoUrl: string | null;
    groupeCode: string | null;
    groupeLabel: string | null;
    region: string | null;
    departement: string | null;
    numCirco: string | null;
    legislature: number;
    lienAN: string;
};

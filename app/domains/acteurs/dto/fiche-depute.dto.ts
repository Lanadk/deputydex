export type FicheDeputeDTO = {
    uid: string;
    civilite: string | null;
    prenom: string | null;
    nom: string | null;
    trigramme: string | null;
    dateNaissance: string | null;
    villeNaissance: string | null;
    departementNaissance: string | null;
    paysNaissance: string | null;

    professionLibelle: string | null;
    professionCategorie: string | null;
    professionFamille: string | null;

    circonscription: string | null;
    departement: string | null;
    region: string | null;
    premiereElection: boolean | null;
    dateDebutMandat: string | null;
    mandatsCount: number;
    legislature: number;

    uriHatvp: string | null;
    urlAssemblee: string;
    image: string | null;
};
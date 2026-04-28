export type DeputeIdentityEntity = {
    uid: string;
    prenom: string | null;
    nom: string | null;
    civilite: string | null;
    date_naissance: Date | null;
    profession_libelle: string | null;
    profession_categorie: string | null;
    profession_famille: string | null;
    photo_path: string | null;
    groupe_code: string | null;
    groupe_label: string | null;
    region: string | null;
    departement: string | null;
    num_circo: string | null;
};
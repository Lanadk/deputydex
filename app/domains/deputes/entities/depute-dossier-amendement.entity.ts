export type DeputeDossierAmendementEntity = {
    uid: string;
    legislature_snapshot: number;
    numero_long: string | null;
    division_titre: string | null;
    sort: string | null;
    etat_libelle: string | null;
    date_depot: Date | null;
    expose_sommaire: string | null;
};

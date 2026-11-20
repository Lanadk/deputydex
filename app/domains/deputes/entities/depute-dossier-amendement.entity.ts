export type DeputeDossierAmendementEntity = {
    uid: string;
    legislature_snapshot: number;
    numero_long: string | null;
    division_titre: string | null;
    sort: string | null;
    etat_libelle: string | null;
    date_depot: Date | null;
    expose_sommaire: string | null;
    /** Texte amendé */
    texte_uid: string;
    texte_type: string | null;
    texte_numero: string | null;
    /** Code de l'étape racine du texte (AN1, ANNLEC…), si l'open data le rattache à une étape */
    texte_etape: string | null;
};

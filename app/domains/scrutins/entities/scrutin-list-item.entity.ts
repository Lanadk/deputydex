export type ScrutinListItemEntity = {
    uid: string;
    numero: string | null;
    date_scrutin: Date | null;
    titre: string | null;
    type_scrutin_code: string | null;
    resultat_code: string | null;
    /** Objet déduit du titre ("ensemble", "article", "amendement", "motion", "autre") */
    objet: string;
    total_pour: number | null;
    total_contre: number | null;
    total_abstentions: number | null;
};

/** Une page de résultats et le nombre total de scrutins correspondant aux filtres. */
export type ScrutinListPageEntity = {
    rows: ScrutinListItemEntity[];
    total: number;
};

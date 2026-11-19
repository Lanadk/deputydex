export type ScrutinListItemDTO = {
    uid: string;
    numero: string | null;
    /** Date ISO (jour seul, minuit UTC) */
    date: string | null;
    titre: string | null;
    type: { code: string | null; libelle: string | null };
    resultat: { isAdopte: boolean; libelle: string | null };
    objet: { code: string; libelle: string };
    pour: number | null;
    contre: number | null;
    abstentions: number | null;
};

export type ScrutinListPageDTO = {
    items: ScrutinListItemDTO[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
};

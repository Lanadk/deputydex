/** Vote d'un groupe sur un scrutin (`scrutins_groupes` + `scrutins_groupes_agregats`). */
export type ScrutinGroupeVoteEntity = {
    groupe_code: string;
    groupe_label: string | null;
    nombre_membres: number | null;
    position_majoritaire: string | null;
    pour: number | null;
    contre: number | null;
    abstentions: number | null;
    non_votants: number | null;
};

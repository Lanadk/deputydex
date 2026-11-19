export type DeputeRecentVoteEntity = {
    scrutin_uid: string;
    scrutin_numero: string | null;
    titre: string | null;
    date_scrutin: Date | null;
    position: string;
    groupe_position: string | null;
};

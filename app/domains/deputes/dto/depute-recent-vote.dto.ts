export type DeputeRecentVoteDTO = {
    scrutinUid: string;
    titre: string | null;
    date: string | null;
    position: string;
    groupePosition: string | null;
    isRebel: boolean;
    /** Page du scrutin sur le site de l'AN. */
    lienAN: string | null;
};

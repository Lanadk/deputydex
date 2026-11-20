export type ScrutinDetailEntity = {
    uid: string;
    numero: string | null;
    legislature: number;
    date_scrutin: Date | null;
    titre: string | null;
    type_scrutin_code: string | null;
    type_scrutin_libelle: string | null;
    type_majorite: string | null;
    resultat_code: string | null;
    resultat_libelle: string | null;
    /** Totaux (`scrutins_agregats`), absents si l'agrégat n'existe pas */
    nombre_votants: number | null;
    suffrages_exprimes: number | null;
    suffrages_requis: number | null;
    total_pour: number | null;
    total_contre: number | null;
    total_abstentions: number | null;
    total_non_votants: number | null;
};

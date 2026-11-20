/** Scrutin : identité, résultat et totaux (voir GLOSSARY.md, « Résultat d'un scrutin »). */
export type ScrutinDetailDTO = {
    uid: string;
    numero: string | null;
    legislature: number;
    titre: string | null;
    /** Date ISO (jour seul, minuit UTC) */
    date: string | null;
    type: {
        /** "SPO" (ordinaire), "SPS" (solennel), "MOC" (motion de censure) */
        code: string | null;
        libelle: string | null;
    };
    typeMajorite: string | null;
    resultat: {
        isAdopte: boolean;
        /** "Adopté" / "Rejeté" */
        libelle: string | null;
    };
    totaux: {
        votants: number | null;
        exprimes: number | null;
        requis: number | null;
        pour: number | null;
        contre: number | null;
        abstentions: number | null;
        nonVotants: number | null;
    };
    lienAN: string | null;
};

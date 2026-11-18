/** Rôle de rapporteur tenu par un député à une étape d'un dossier législatif. */
export type DeputeRapporteurDTO = {
    /** Ex. "rapporteur", "rapporteur pour avis" */
    type: string | null;
    /** Libellé de l'étape, ex. "1ère lecture AN" */
    etape: string;
};

/** Contributions d'un député à un dossier législatif, sur une législature (voir GLOSSARY.md). */
export type DeputeDossierContributionDTO = {
    dossierUid: string;
    titre: string;
    procedure: string | null;
    nbDeposes: number;
    nbAdoptes: number;
    nbCosignes: number;
    isAuteurTexte: boolean;
    isCosignataireTexte: boolean;
    rapporteurs: DeputeRapporteurDTO[];
    /** Date ISO de la contribution la plus récente, si connue. */
    derniereActivite: string | null;
    lienAN: string;
};

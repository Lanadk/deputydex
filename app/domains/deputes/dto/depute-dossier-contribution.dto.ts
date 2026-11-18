/** Contribution d'un député à un dossier législatif, sur une législature. */
export type DeputeDossierContributionDTO = {
    dossierUid: string;
    titre: string;
    procedure: string | null;
    nbDeposes: number;
    nbAdoptes: number;
    nbCosignes: number;
    isInitiateur: boolean;
    /** Rôles de rapporteur tenus sur le dossier (ex. "rapporteur pour avis"). */
    rolesRapporteur: string[];
    /** Date ISO de la contribution la plus récente, si connue. */
    derniereActivite: string | null;
    lienAN: string;
};

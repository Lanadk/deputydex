/** Position affichée sur un siège : une position de vote, ou "absent" (n'a pas pris part au vote). */
export type ScrutinSiegePosition = "pour" | "contre" | "abstention" | "non_votant" | "absent";

/** Siège de l'hémicycle lors d'un scrutin. */
export type ScrutinSiegeDTO = {
    /** Numéro de siège AN (1 → 650) */
    place: number;
    deputeUid: string;
    nomComplet: string;
    groupeCode: string | null;
    groupeLabel: string | null;
    position: ScrutinSiegePosition;
    positionLabel: string;
};

/** Hémicycle d'un scrutin : un siège par député en mandat ce jour-là. */
export type ScrutinHemicycleDTO = {
    /** Rangés de la gauche vers la droite de la salle (numéro de siège décroissant) */
    sieges: ScrutinSiegeDTO[];
    totaux: Record<ScrutinSiegePosition, number>;
};

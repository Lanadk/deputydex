/** Une composante du score d'un député (ex. présence, participation aux votes). */
export interface DeputeScoreComposanteDTO {
    id: string;
    label: string;
    /** Ce que la composante mesure, en une phrase. */
    description: string;
    /** Poids dans le score, en % (la somme des poids vaut 100). */
    poids: number;
    /** Sous-score sur 100 ; null = pas de donnée (composante ignorée, poids redistribué). */
    score: number | null;
}

/** Badge obtenu par le député (ex. « Assidu en séance »), affiché sous son score. */
export interface DeputeScoreBadgeDTO {
    id: string;
    label: string;
    /** Ce qui l'a valu, en une phrase (info-bulle). */
    description: string;
}

/**
 * Score d'un député sur 100, pour une législature : moyenne pondérée de ses
 * composantes. Une première idée du député, pas un jugement.
 */
export interface DeputeScoreDTO {
    /** Score sur 100 ; null = pas assez de données. */
    score: number | null;
    /** Part des députés de la législature ayant un score inférieur, en %. */
    percentile: number | null;
    composantes: DeputeScoreComposanteDTO[];
    /** Badges obtenus ; vide = aucun. */
    badges: DeputeScoreBadgeDTO[];
    /** Données fictives (maquette) : l'interface l'annonce. */
    apercu: boolean;
}

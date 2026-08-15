export type GroupeStatPariteEntity = { nb_hommes: number; nb_femmes: number } | null;

export type GroupeStatEffectifRow = {
    groupe_code: string;
    groupe_label: string | null;
    nb_acteurs: number;
};

export type GroupeStatCohesionPointEntity = {
    mois: Date;
    taux_cohesion: number | null;
};

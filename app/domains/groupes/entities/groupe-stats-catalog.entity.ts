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

export type GroupeStatPariteParGroupeRow = {
    groupe_code: string;
    groupe_label: string | null;
    nb_hommes: number;
    nb_femmes: number;
    nb_total: number;
};

export type GroupeFeminisationMouvementRow = {
    groupe_code: string;
    groupe_label: string | null;
    femmes_arrivees: number;
    femmes_parties: number;
};

export type GroupeStatAgeParGroupeRow = {
    groupe_code: string;
    groupe_label: string | null;
    /** Moyenne d'âge des membres du groupe à la date de référence — arrondie à 1 décimale, source `agg_groupes_stats_age`. */
    average_age: number;
};

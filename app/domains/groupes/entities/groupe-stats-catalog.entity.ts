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

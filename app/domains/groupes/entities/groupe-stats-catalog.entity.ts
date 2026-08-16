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

export type GroupeStatPositionVoteRow = {
    groupe_code: string;
    groupe_label: string | null;
    /** Valeurs possibles : 'pour' | 'contre' | 'abstention' — source `agg_groupes_stats_votes_positions_politiques`. */
    position: string;
    /** Part (%) de cette position dans les votes politiques du groupe — déjà calculée par la vue. */
    pourcentage: number;
};

export type GroupeStatExpressionVoteRow = {
    groupe_code: string;
    groupe_label: string | null;
    /** % de positions politiques (pour/contre/abstention) parmi TOUTES les positions observées (non-votants inclus) — source `agg_groupes_stats_expression_votes`. */
    taux_expression_votes: number | null;
};

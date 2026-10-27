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

export type GroupeStatCohesionParGroupeRow = {
    groupe_code: string;
    groupe_label: string | null;
    taux_cohesion: number | null;
};

export type GroupeStatCohesionEvolutionTousRow = {
    groupe_code: string;
    groupe_label: string | null;
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

export type GroupeStatCumulMandatsParGroupeRow = {
    groupe_code: string;
    groupe_label: string | null;
    /** Ancienneté moyenne (années cumulées en mandat de groupe parlementaire, toutes législatures en base) des membres du groupe à la date de référence — arrondie à 1 décimale, source `agg_groupes_stats_cumul_mandats`. */
    average_cumulated_years: number;
};

/** Une ligne par PAIRE de groupes (A < B par groupe_id, chaque paire n'apparaît qu'une fois) — source `agg_groupes_stats_proximite_votes_legislature`. */
export type GroupeProximitePaireRow = {
    groupe_a_code: string;
    groupe_a_label: string | null;
    groupe_b_code: string;
    groupe_b_label: string | null;
    /** Scrutins où les deux groupes ont une position majoritaire politique (pour/contre/abstention). */
    nb_scrutins_communs: number;
    /** Parmi ces scrutins, ceux où les deux positions majoritaires sont identiques — c'est ce comptage (pas `taux_proximite`) qui permet d'additionner deux codes d'un même groupe renommé. */
    nb_scrutins_alignes: number;
    /** Part de ces scrutins où les deux positions majoritaires sont identiques — échelle 0-1. */
    taux_proximite: number | null;
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

export type GroupeStatParticipationRow = {
    groupe_code: string;
    groupe_label: string | null;
    /** % de scrutins éligibles réellement participés (pour/contre/abstention), moyenne pondérée sur la législature — source `agg_groupes_stats_participation_legislature`. */
    taux_participation: number | null;
};

export type GroupeStatParticipationEvolutionPointEntity = {
    mois: Date;
    taux_participation_moyen: number | null;
};

/** Une ligne par (groupe, mois) — TOUS les groupes d'une législature (pas un seul, contrairement à `GroupeStatParticipationEvolutionPointEntity`), pour le graphe superposé par défaut de `entity-chart`. */
export type GroupeStatParticipationEvolutionTousRow = {
    groupe_code: string;
    groupe_label: string | null;
    mois: Date;
    taux_participation_moyen: number | null;
};

/** Ligne "brute" ref_groupes — PAS filtrée sur l'effectif ni sur les VRAIS NI (NI-16/NI-17 inclus, groupes à 0 membre courant inclus) : sert à peupler un sélecteur "n'importe quel groupe ayant existé cette législature", contrairement à `getGroupesCards`/`getEffectifs`. TBD et le groupe "NI (groupe technique)" (ex: PO0) restent exclus, eux ne sont jamais de vrais groupes. */
export type GroupeListItemRow = {
    groupe_code: string;
    groupe_label: string | null;
};

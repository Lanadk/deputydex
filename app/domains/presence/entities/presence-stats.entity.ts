/**
 * Lignes lues dans les vues de présence de deputydex-data (`agg_*_presence*`,
 * domaine `presence` côté ETL — démarche dans
 * `deputydex-data/src/sql/scripts/presence/README.md`). Formes proches des
 * vues ; les taux sont des pourcentages déjà arrondis à 1 décimale par la vue.
 */

/** Type d'année des vues `agg_*_presence_annuelle`. */
export type PresenceTypePeriode = "civile" | "parlementaire" | "mandat";

/** Taux et volume d'un député sur une législature (`agg_deputes_presence`). */
export interface DeputePresenceLegislatureRow {
    legislature: number;
    jours_attendus: number;
    jours_presents: number;
    taux_presence: number | null;
    taux_presence_seance: number | null;
    taux_presence_commission: number | null;
    taux_participation_scrutins: number | null;
    jours_presence: number;
    jours_vote: number;
    jours_debat: number;
    jours_commission: number;
    jours_presence_par_mois: number | null;
}

/** Prise de fonction d'un député dans une législature (début de son « année de mandat 1 »). */
export interface DeputeDebutMandatRow {
    legislature: number;
    debut_mandat: Date;
}

/** Un mois d'un député (`agg_deputes_presence_mensuelle`). */
export interface DeputePresenceMoisRow {
    legislature: number;
    mois: Date;
    taux_presence: number | null;
    jours_presence: number;
}

/** Une année d'un député (`agg_deputes_presence_annuelle`). */
export interface PresenceAnneeRow {
    legislature: number;
    periode: string;
    jours_presence_par_mois: number | null;
    taux_presence: number | null;
}

/** Un groupe sur une législature (`agg_groupes_presence`, code via `ref_groupes`). */
export interface GroupePresenceRow {
    groupe_code: string;
    groupe_label: string | null;
    taux_presence: number | null;
    taux_presence_seance: number | null;
    taux_presence_commission: number | null;
    taux_excuses_commission: number | null;
    taux_participation_scrutins: number | null;
    jours_presence_par_mois: number | null;
}

/** Composantes du taux de présence, chacune une colonne des vues `agg_*_presence`. */
export type PresenceComposante = "seance" | "commission" | "excuses" | "scrutins";

/** Un mois d'un groupe (`agg_groupes_presence_mensuelle`). */
export interface GroupePresenceMoisRow {
    groupe_code: string;
    groupe_label: string | null;
    mois: Date;
    taux_presence: number | null;
}

/** Une année d'un groupe (`agg_groupes_presence_annuelle`). */
export interface GroupePresenceAnneeRow {
    groupe_code: string;
    periode: string;
    jours_presence_par_mois: number | null;
}

/** L'Assemblée sur une législature (`agg_assemblee_presence`). */
export interface AssembleePresenceLegislatureRow {
    legislature: number;
    taux_presence: number | null;
    taux_presence_seance: number | null;
    taux_presence_commission: number | null;
    taux_excuses_commission: number | null;
    taux_participation_scrutins: number | null;
    jours_presence_par_mois: number | null;
    effectif_moyen: number | null;
}

/** Un mois de l'Assemblée (`agg_assemblee_presence_mensuelle`). */
export interface AssembleePresenceMoisRow {
    legislature: number;
    mois: Date;
    taux_presence: number | null;
    jours_presence_par_depute: number | null;
}

/** Un jour de séance observable de l'Assemblée (`agg_assemblee_presence_jour`). */
export interface AssembleePresenceJourRow {
    jour: Date;
    /** Présents en séance ÷ députés en mandat. */
    taux_presence_seance: number | null;
    /** Présents (séance ou commission) ÷ députés attendus ce jour-là. */
    taux_presence: number | null;
    /** Députés présents ce jour-là, toutes sources, attendus ou non. */
    deputes_presents_total: number;
}

/** Un jour de la semaine de l'Assemblée (`agg_assemblee_presence_jour_semaine`). */
export interface AssembleePresenceJourSemaineRow {
    legislature: number;
    jour_semaine: number;
    taux_presence: number | null;
}

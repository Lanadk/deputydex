import {
    GroupeFeminisationMouvementRow,
    GroupeStatAgeParGroupeRow,
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatExpressionVoteRow,
    GroupeStatPariteEntity,
    GroupeStatPariteParGroupeRow,
    GroupeStatPositionVoteRow,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

export interface IGroupesStatsRepository {
    getParite(code: string, legislature: number): Promise<GroupeStatPariteEntity>;

    /** Parité hommes/femmes agrégée sur TOUS les groupes d'une législature (la "moyenne" du domaine) — utilisé par les insights, pas exposé comme stat du catalogue. */
    getPariteMoyenne(legislature: number): Promise<GroupeStatPariteEntity>;

    getEffectifs(legislature: number): Promise<GroupeStatEffectifRow[]>;

    getCohesionEvolution(code: string, legislature: number): Promise<GroupeStatCohesionPointEntity[]>;

    /**
     * Parité, une ligne par groupe POLITIQUE de la législature (Non inscrits
     * exclu — ce n'est pas un groupe politique) — pour un classement, pas
     * pour un seul groupe (voir `getParite`). Source : `agg_groupes_stats_parite`,
     * comme `getParite`/`getPariteMoyenne`.
     */
    getPariteParGroupe(legislature: number): Promise<GroupeStatPariteParGroupeRow[]>;

    /**
     * Combien de femmes chaque groupe politique a intégrées/perdues DURANT la
     * législature (hors composition initiale du jour de constitution du
     * groupe) — voir la méthodologie dans `feminisation-groupes.sections.ts`
     * pour la définition exacte ("intégré" / "perdu").
     */
    getFeminisationMouvements(legislature: number): Promise<GroupeFeminisationMouvementRow[]>;

    /**
     * Âge moyen, une ligne par groupe POLITIQUE de la législature (Non inscrits
     * exclu — même périmètre que `getPariteParGroupe`) — pour un classement.
     * Source : `agg_groupes_stats_age`.
     */
    getAgeParGroupe(legislature: number): Promise<GroupeStatAgeParGroupeRow[]>;

    /**
     * Répartition pour/contre/abstention, une ligne par (groupe POLITIQUE,
     * position) — pour un classement tous groupes confondus. Source :
     * `agg_groupes_stats_votes_positions_politiques`, construite depuis les
     * votes individuels historiques : un groupe renommé/dissous en cours de
     * législature (ex: UDR → UDDPR) y garde des lignes même après que tous
     * ses membres ont basculé vers le nouveau code — le repository doit donc
     * filtrer sur l'effectif COURANT (`agg_groupes_effectifs_legislature`),
     * pas seulement sur l'existence de votes.
     */
    getPositionsVoteParGroupe(legislature: number): Promise<GroupeStatPositionVoteRow[]>;

    /**
     * Taux d'expression aux scrutins, une ligne par groupe POLITIQUE — % de
     * positions politiques (pour/contre/abstention) parmi toutes les
     * positions observées (non-votants inclus). Source :
     * `agg_groupes_stats_expression_votes`. Même précaution que
     * `getPositionsVoteParGroupe` : filtrer sur l'effectif COURANT, pas
     * seulement sur l'existence de la ligne dans la vue.
     */
    getExpressionVotesParGroupe(legislature: number): Promise<GroupeStatExpressionVoteRow[]>;
}

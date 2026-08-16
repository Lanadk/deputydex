import {
    GroupeFeminisationMouvementRow,
    GroupeListItemRow,
    GroupeStatAgeParGroupeRow,
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatExpressionVoteRow,
    GroupeStatParticipationEvolutionPointEntity,
    GroupeStatParticipationEvolutionTousRow,
    GroupeStatParticipationRow,
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

    /**
     * Taux de participation aux scrutins (moyenne pondérée par le nombre de
     * scrutins éligibles, pas une moyenne simple des mois), une ligne par
     * groupe POLITIQUE. Source : `agg_groupes_stats_participation_legislature`.
     * Même précaution que `getPositionsVoteParGroupe`/`getExpressionVotesParGroupe` :
     * filtrer sur l'effectif COURANT, pas seulement sur l'existence de la ligne.
     */
    getParticipationParGroupe(legislature: number): Promise<GroupeStatParticipationRow[]>;

    /**
     * Évolution mensuelle du taux de participation, pour UN groupe précis —
     * source `agg_groupes_stats_participation_mensuelle`. Contrairement à
     * `getParticipationParGroupe`, pas de filtre sur l'effectif COURANT ici :
     * la vue est nativement construite depuis l'appartenance historique
     * (`acteurs_groupes`), donc un groupe renommé/dissous en cours de
     * législature (ex: UDR → UDDPR) garde légitimement ses points pour les
     * mois où il existait — c'est le but recherché (voir `listGroupesLegislature`).
     */
    getParticipationEvolutionParGroupe(code: string, legislature: number): Promise<GroupeStatParticipationEvolutionPointEntity[]>;

    /**
     * Même source que `getParticipationEvolutionParGroupe`, mais TOUS les
     * groupes de la législature (pas un seul) — pour le graphe superposé par
     * défaut de `entity-chart`. Même périmètre que `listGroupesLegislature`
     * (Non inscrits réels inclus, TBD et "NI (groupe technique)" exclus,
     * pas de filtre sur l'effectif courant).
     */
    getParticipationEvolutionTousGroupes(legislature: number): Promise<GroupeStatParticipationEvolutionTousRow[]>;

    /**
     * Liste BRUTE des groupes d'une législature (`ref_groupes`), pour un
     * sélecteur "n'importe quel groupe ayant existé" — PAS la même liste
     * que `getGroupesCards`/`getEffectifs` : les VRAIS Non inscrits
     * ("NI-16"/"NI-17") et les groupes dont l'effectif courant est retombé
     * à 0 (renommés/dissous en cours de législature) sont INCLUS ici,
     * puisqu'ils ont bien eu une activité de vote pendant qu'ils existaient.
     * Exclus : "TBD" (placeholder technique) et le groupe "NI (groupe
     * technique)" (ex: PO0 en 17ᵉ législature) — un rattachement
     * administratif transitoire, jamais un vrai groupe.
     */
    listGroupesLegislature(legislature: number): Promise<GroupeListItemRow[]>;
}

/**
 * Domaines exposant des stats dans le catalogue Statistiques.
 * `votes` et `scrutins` n'ont pas encore de backend (repository/use-case) —
 * le slot existe dans le pattern, le registre reste vide jusqu'à leur
 * implémentation (voir _shared/statistics/catalog/domains/<domain>/registry.ts).
 */
export type StatDomain = "acteurs" | "groupes" | "votes" | "scrutins" | "legislatures";

/**
 * - "aggregate" = stat calculée sur une POPULATION, éventuellement filtrée
 *   (tous les députés, les députés d'un groupe, les scrutins d'une
 *   législature...).
 * - "entity" = stat d'UN élément précis identifié par son id
 *   (un député, un groupe, un scrutin).
 *
 * Le comparateur n'autorise la comparaison qu'entre deux stats de même
 * domaine ET même scope (aggregate vs aggregate, entity vs entity) — deux
 * populations filtrées différemment peuvent se comparer, deux entités
 * différentes peuvent se comparer, mais pas les deux entre elles.
 */
export type StatScope = "aggregate" | "entity";

export interface StatFetchParams {
    /** scope === "entity" : id de l'élément précis (député, groupe, scrutin) */
    entityId?: string;
    /** scope === "aggregate" : filtres définissant la population (legislature, groupeCode...) */
    filters?: Record<string, unknown>;
}

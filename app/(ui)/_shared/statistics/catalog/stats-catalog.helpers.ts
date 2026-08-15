import { StatDomainModule } from "@/app/(ui)/_shared/statistics/catalog/stats-domain.types";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { StatDomain, StatScope } from "@/app/_shared/statistics/stat-scope.types";

export function findStatDefinition(catalog: StatDomainModule[], id: string): StatDefinition | null {
    return catalog.flatMap((module) => module.stats).find((stat) => stat.id === id) ?? null;
}

/**
 * Stats "comparables" à une contrainte donnée (même domain + même scope).
 * `constraint: null` = aucune contrainte, tout le catalogue est éligible —
 * c'est le cas avant que l'autre slot du comparateur ait une sélection.
 *
 * Utilisé à la fois par le picker (pour ne JAMAIS proposer un choix
 * incompatible dans sa liste) et par le reducer (garde-fou défensif, voir
 * comparator.reducer.ts) — l'incompatibilité doit être impossible à
 * atteindre, pas corrigée après coup.
 */
export function getComparableStats(
    catalog: StatDomainModule[],
    constraint: { domain: StatDomain; scope: StatScope } | null
): StatDefinition[] {
    const all = catalog.flatMap((module) => module.stats);
    if (!constraint) return all;
    return all.filter((stat) => stat.domain === constraint.domain && stat.scope === constraint.scope);
}

/**
 * Regroupe une liste de stats par `category`, en préservant l'ordre
 * d'apparition des catégories (utilisé par le picker domaine/catégorie).
 */
export function groupStatsByCategory(stats: StatDefinition[]): { category: string; stats: StatDefinition[] }[] {
    const groups: { category: string; stats: StatDefinition[] }[] = [];

    for (const stat of stats) {
        const group = groups.find((g) => g.category === stat.category);
        if (group) {
            group.stats.push(stat);
        } else {
            groups.push({ category: stat.category, stats: [stat] });
        }
    }

    return groups;
}

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

/** Insensible à la casse et aux accents ("legislature" doit matcher "législature"). */
function normalize(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

/**
 * Recherche plein-texte dans TOUT le catalogue (titre, catégorie, domaine,
 * mots-clés, description) — voir StatSearch, le composant qui l'utilise pour
 * laisser parcourir/filtrer "toutes les combinaisons" du catalogue sans
 * passer par le picker domaine → scope → catégorie.
 *
 * Requête vide = tout le catalogue, dans l'ordre du registre (permet de
 * *parcourir* sans avoir à taper). Le titre pèse plus que la description
 * dans le tri : un match dans le titre remonte avant un match seulement
 * dans un mot-clé ou la description.
 */
export function searchStats(catalog: StatDomainModule[], query: string): StatDefinition[] {
    const all = catalog.flatMap((m) => m.stats);
    const q = normalize(query.trim());
    if (!q) return all;

    return all
        .map((stat) => {
            const statModule = catalog.find((m) => m.id === stat.domain);
            const haystacks: { text: string; weight: number }[] = [
                { text: stat.title, weight: 3 },
                { text: stat.category, weight: 2 },
                { text: statModule?.label ?? "", weight: 2 },
                ...stat.keywords.map((k) => ({ text: k, weight: 2 })),
                { text: stat.description ?? "", weight: 1 },
            ];
            const score = haystacks.reduce(
                (max, h) => (h.text && normalize(h.text).includes(q) ? Math.max(max, h.weight) : max),
                0
            );
            return { stat, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score) // .sort() est stable (ES2019+) : à score égal, l'ordre du catalogue est préservé
        .map((entry) => entry.stat);
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

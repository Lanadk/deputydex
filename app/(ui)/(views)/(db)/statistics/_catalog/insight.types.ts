import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

/**
 * Produit une phrase d'analyse pour une stat déjà chargée ("Le RN a un taux
 * de femmes de 46%, au-dessus de la moyenne des groupes..."), ou `null` si
 * rien d'intéressant n'est calculable (scope aggregate, pas de législature
 * précédente, etc.) — dans ce cas le graphe s'affiche sans texte, jamais de
 * phrase à moitié vide.
 *
 * Volontairement spécifique par stat (clé = StatDefinition.id) plutôt que
 * générique par forme de donnée : savoir QUOI comparer ("la législature
 * précédente", "la moyenne du domaine"...) dépend du sens métier de la stat,
 * pas de sa forme. Voir insight-resolvers.registry.ts.
 */
export type InsightResolver = (
    definition: StatDefinition,
    context: StatFetchParams,
    current: RawStatData
) => Promise<string | null>;

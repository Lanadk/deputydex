import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";
import { ChartColorVariant } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

export type EntityChartOption = { code: string; label: string };

/**
 * Chart multi-séries avec sélection à la volée — toutes les entités sont
 * affichées par défaut, superposées ; chaque bouton bascule l'affichage de
 * SA série (pas un sélecteur exclusif "une seule à la fois") : on peut
 * retirer/remettre des courbes sans recharger de données, un seul fetch
 * (la stat aggregate) suffit pour toutes les entités — le filtrage se fait
 * côté client sur `RawStatData.series`. `statSlug` doit donc être une stat
 * scope "aggregate", dataShape "multi-series" (voir `catalog/domains/<domain>/registry.ts`).
 */
export type EntityChartConfig = {
    id: string;
    title: string;
    subtitle?: string;
    statDomain: StatDomain;
    statSlug: string;
    displayType: "line-multi" | "line-dashed-multi" | "bar-multi";
    variant?: ChartColorVariant;
    /** Label au-dessus des boutons (ex: "Groupes affichés") */
    entityLabel?: string;
};

export type EntityChartDataWrapper = { entities: EntityChartOption[] };

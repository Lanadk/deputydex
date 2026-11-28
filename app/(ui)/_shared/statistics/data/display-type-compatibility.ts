import { StatDataShape } from "@/app/_shared/statistics/raw-stat-data.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

type ChartDisplayType = ChartConfig["displayType"];

/**
 * Formats de visualisation compatibles avec chaque forme de donnée — pilote
 * le format-switcher (feature "changer le format de la stat"). "scalar" n'a
 * pas d'équivalent chart : il se rend en KPI card, hors de ce mapping.
 */
export const DISPLAY_TYPE_COMPATIBILITY: Record<StatDataShape, ChartDisplayType[]> = {
    distribution: ["bar", "pie", "donut"],
    timeseries: ["line", "line-dashed", "bar"],
    "multi-series": ["bar-multi", "stacked-bar", "line-multi", "line-dashed-multi"],
    points: ["scatter"],
    scalar: [],
};

/**
 * Formats proposés pour UNE stat : ceux de sa forme de donnée, moins ceux
 * qu'elle exclut (`excludedDisplayTypes`, ex: pas de camembert pour un
 * classement de taux). Si l'exclusion retirait tout, on garde la liste
 * complète plutôt que de ne rien pouvoir afficher.
 */
export function compatibleDisplayTypesFor(definition: Pick<StatDefinition, "dataShape" | "excludedDisplayTypes">): ChartDisplayType[] {
    const all = DISPLAY_TYPE_COMPATIBILITY[definition.dataShape];
    const excluded = definition.excludedDisplayTypes ?? [];
    const allowed = all.filter((dt) => !excluded.includes(dt));
    return allowed.length > 0 ? allowed : all;
}

/** Libellés FR affichés dans le format-switcher (SelectLib), un par displayType du catalogue. */
export const DISPLAY_TYPE_LABELS: Record<ChartDisplayType, string> = {
    bar: "Barres",
    pie: "Camembert",
    donut: "Donut",
    line: "Courbe",
    "line-dashed": "Courbe pointillée",
    "bar-multi": "Barres groupées",
    "stacked-bar": "Barres empilées",
    "line-multi": "Courbes multiples",
    "line-dashed-multi": "Courbes pointillées multiples",
    scatter: "Nuage de points",
};

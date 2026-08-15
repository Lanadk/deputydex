import { StatDataShape } from "@/app/_shared/statistics/raw-stat-data.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";

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

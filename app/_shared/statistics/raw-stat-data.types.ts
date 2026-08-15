/**
 * Donnée normalisée retournée par le fetch d'une stat du catalogue
 * Statistiques. La FORME (`shape`) est fixe et vient du calcul serveur ;
 * le FORMAT d'affichage (bar/donut/line/...) est un choix runtime de
 * l'utilisateur, résolu séparément via `DISPLAY_TYPE_COMPATIBILITY`
 * (voir app/(ui)/(views)/(db)/statistics/_catalog/display-type-compatibility.ts).
 *
 * Volontairement découplé de `ChartDataWrapper` (block-section/chart-config.types.ts)
 * qui, lui, fige forme + format ensemble pour les blocks de page statiques
 * (groupes/[code]...). Ici la même donnée doit pouvoir se rendre dans
 * plusieurs formats au choix de l'utilisateur, d'où la séparation.
 */
export type StatDataShape = "distribution" | "timeseries" | "multi-series" | "points" | "scalar";

export type RawStatData =
    | { shape: "distribution"; items: { label: string; value: number }[] }
    | { shape: "timeseries"; points: { label: string; value: number }[] }
    | { shape: "multi-series"; series: { name: string; items: { label: string; value: number }[] }[] }
    | { shape: "points"; points: { x: number; y: number; label?: string }[] }
    | { shape: "scalar"; value: number | string; label?: string };

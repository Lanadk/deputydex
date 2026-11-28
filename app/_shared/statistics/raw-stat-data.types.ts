/**
 * Donnée normalisée retournée par le fetch d'une stat du catalogue
 * Statistiques. La FORME (`shape`) est fixe et vient du calcul serveur ;
 * le FORMAT d'affichage (bar/donut/line/...) est un choix runtime de
 * l'utilisateur, résolu séparément via `DISPLAY_TYPE_COMPATIBILITY`
 * (voir app/(ui)/_shared/statistics/data/display-type-compatibility.ts).
 *
 * Volontairement découplé de `ChartDataWrapper` (block-section/chart-config.types.ts)
 * qui, lui, fige forme + format ensemble pour les blocks de page statiques
 * (groupes/[code]...). Ici la même donnée doit pouvoir se rendre dans
 * plusieurs formats au choix de l'utilisateur, d'où la séparation.
 */
export type StatDataShape = "distribution" | "timeseries" | "multi-series" | "points" | "scalar";

/**
 * Précision de contexte calculée côté serveur, affichée sous le libellé du
 * graphe — ex: « En fonction depuis le 26/07/2026 (17ᵉ législature) » pour un
 * député arrivé en cours de législature, afin qu'une courbe courte ne passe
 * pas pour un trou dans les données.
 */
export type StatNote = { note?: string };

/**
 * Repère vertical sur l'axe des libellés d'une courbe (ex: « Début de la
 * 17ᵉ législature » sur une courbe toutes législatures confondues). `at` est
 * l'un des libellés de la série ; calculé côté serveur depuis les données
 * (`param_legislatures`), jamais écrit en dur.
 */
export type StatMarker = { at: string; label: string };

export type StatMarkers = { markers?: StatMarker[] };

export type RawStatData = StatNote & StatMarkers & (
    | { shape: "distribution"; items: { label: string; value: number }[] }
    | { shape: "timeseries"; points: { label: string; value: number }[] }
    | { shape: "multi-series"; series: { name: string; items: { label: string; value: number }[] }[] }
    | { shape: "points"; points: { x: number; y: number; label?: string }[] }
    | { shape: "scalar"; value: number | string; label?: string });

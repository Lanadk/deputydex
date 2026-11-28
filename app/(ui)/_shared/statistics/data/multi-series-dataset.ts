import { MultiDatum, SeriesConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";

/**
 * Pivote une liste de séries "longues" (une entrée par série, chacune avec
 * ses propres {label, value}) vers le format "large" attendu par
 * BarChartLib/LineChartLib en mode multi-séries (une ligne par label, une
 * colonne par série). `stacked` ajoute un `stack` commun à toutes les
 * séries — c'est ce qui fait un bar-multi empilé plutôt que groupé, sans
 * dépendre du StackedBarChartLib (celui-ci est figé sur pour/contre/abstention,
 * non réutilisable pour une donnée de catalogue générique).
 *
 * Partagé par le mode avancé (`RenderStatChart`) et les sections qui affichent
 * une stat multi-séries du catalogue (Chiffres clés).
 */
export function toMultiSeriesDataset(
    series: { name: string; items: { label: string; value: number }[] }[],
    stacked = false
): { data: MultiDatum[]; series: SeriesConfig[] } {
    // Triés : l'ordre d'apparition dans `series` (première série qui
    // mentionne un label donné) ne correspond pas forcément à l'ordre
    // chronologique — ex: groupes.participation-evolution-groupes, où
    // chaque groupe démarre à un mois différent. Un tri lexicographique
    // suffit : les libellés sont « YYYY-MM », ou préfixés d'un rang
    // (« 1 · Lundi », « 1 · Présence… ») par les mappers du domaine presence.
    const labels = Array.from(new Set(series.flatMap((s) => s.items.map((item) => item.label)))).sort((a, b) =>
        a.localeCompare(b)
    );

    const seriesConfig: SeriesConfig[] = series.map((s, i) => ({
        dataKey: `s${i}`,
        label: s.name,
        ...(stacked ? { stack: "stack" } : {}),
    }));

    const data: MultiDatum[] = labels.map((label) => {
        const row: MultiDatum = { label };
        series.forEach((s, i) => {
            row[`s${i}`] = s.items.find((item) => item.label === label)?.value ?? null;
        });
        return row;
    });

    return { data, series: seriesConfig };
}

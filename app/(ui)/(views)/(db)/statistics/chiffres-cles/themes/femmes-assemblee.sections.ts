import { Venus } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { card, chart } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

function pctFemmes(items: { label: string; value: number }[]): number {
    const hommes = items.find((i) => i.label === "Hommes")?.value ?? 0;
    const femmes = items.find((i) => i.label === "Femmes")?.value ?? 0;
    const total = hommes + femmes;
    return total > 0 ? Math.round((femmes / total) * 1000) / 10 : 0;
}

/**
 * "Femmes à l'Assemblée" — premier thème "Chiffres clés" réellement branché,
 * sert de gabarit aux suivants. Zéro nouveau backend : réutilise tel quel
 * `acteurs.parite` (répartition actuelle) et `legislatures.parite`
 * (évolution) via `statisticsGateway.fetchStat`, exactement les mêmes
 * handlers que ceux consommés par `StatViewer` en mode avancé — seule la
 * présentation change (page éditoriale figée plutôt que stat interchangeable
 * et comparable).
 */
export const FEMMES_ASSEMBLEE_SECTIONS: PageSection[] = [
    {
        id: "femmes-assemblee-vue-ensemble",
        label: "Les femmes à l'Assemblée nationale",
        icon: Venus,
        description:
            "La parité à l'Assemblée nationale n'a jamais été atteinte : la part de femmes élues varie fortement " +
            "d'une législature à l'autre. " +
            "Taux de féminisation = nombre de député·es femmes / (femmes + hommes) × 100 — calculé sur l'ensemble " +
            "des député·es actuellement en mandat pour le graphique de répartition, et sur l'ensemble des député·es " +
            "ayant siégé pour l'évolution par législature.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [repartition, evolution] = await Promise.all([
                statisticsGateway.fetchStat("acteurs", "parite", { filters: { legislature: leg } }),
                statisticsGateway.fetchStat("legislatures", "parite", {}),
            ]);

            const items = repartition.shape === "distribution" ? repartition.items : [];
            const points = evolution.shape === "timeseries" ? evolution.points : [];

            return {
                "kpi-femmes-part-actuelle": {
                    // Le chiffre seul ne dit jamais de quelle législature il parle —
                    // voir StatViewer.contextLabel (mode avancé), même principe ici.
                    data: { label: `de femmes députées — ${leg}ᵉ législature`, value: `${pctFemmes(items)}%` },
                },
                "chart-femmes-repartition-actuelle": { data: items },
                "chart-femmes-evolution-legislatures": { data: points },
            } satisfies Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "paragraph",
                colSpan: 4,
                items: [
                    {
                        type: "text",
                        content:
                            "Depuis l'instauration de la parité intégrale des candidatures (lois de 2000 et 2007), " +
                            "la part de femmes élues à l'Assemblée nationale a progressé de façon irrégulière — " +
                            "chaque législature reste un scrutin majoritaire, pas un scrutin de liste, ce qui limite " +
                            "l'effet mécanique des obligations de parité des candidatures.",
                    },
                ],
            },
            { type: "card", colSpan: 1, config: card("kpi-femmes-part-actuelle") },
            { type: "chart", colSpan: 3, config: chart("chart-femmes-repartition-actuelle") },
            { type: "chart", colSpan: 4, config: chart("chart-femmes-evolution-legislatures") },
        ],
    },
];

import { PieChart } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { MultiDatum } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { StackedBarDatum } from "@/app/(ui)/component-library/molecules/chart/bar-chart/stacked-bar-chart-lib";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { card, chart } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

/** Une série par groupe (`groupes.positions-de-vote`, shape `multi-series`) → une ligne par groupe pour `StackedBarChartLib`, figé sur pour/contre/abstention. */
function toStackedBarData(series: { name: string; items: { label: string; value: number }[] }[]): StackedBarDatum[] {
    return series.map((s) => ({
        label: s.name,
        pour: s.items.find((i) => i.label === "Pour")?.value ?? 0,
        contre: s.items.find((i) => i.label === "Contre")?.value ?? 0,
        abstention: s.items.find((i) => i.label === "Abstention")?.value ?? 0,
    }));
}

type PositionsRecitData = { legislature: number; rows: StackedBarDatum[] };

function maxBy(rows: StackedBarDatum[], key: "pour" | "contre" | "abstention"): StackedBarDatum | null {
    if (rows.length === 0) return null;
    return rows.reduce((best, r) => (r[key] > best[key] ? r : best), rows[0]);
}

/**
 * Récit dynamique — extrêmes sur chaque position (le groupe qui vote le plus
 * souvent "pour", "contre", ou s'abstient le plus). Les groupes sans membre
 * actuel (renommés/dissous, ex: UDR → UDDPR) sont déjà exclus en amont par
 * `getPositionsVoteParGroupe` — pas de filtrage supplémentaire nécessaire ici.
 */
function buildPositionsRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as PositionsRecitData | undefined;
    if (!dto || dto.rows.length === 0) return [{ type: "text", content: "Données indisponibles pour l'instant." }];

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature, hors non-votants.` },
    ];

    const plusPour = maxBy(dto.rows, "pour");
    const plusContre = maxBy(dto.rows, "contre");
    const plusAbstention = maxBy(dto.rows, "abstention");

    if (plusPour) {
        items.push({ type: "highlight", content: `${plusPour.label} est le groupe qui vote le plus souvent "pour", dans ${plusPour.pour}% des votes exprimés.` });
    }
    if (plusContre) {
        items.push({ type: "highlight", content: `${plusContre.label} est celui qui vote le plus souvent "contre", dans ${plusContre.contre}% des votes exprimés.` });
    }
    if (plusAbstention) {
        items.push({ type: "text", content: `${plusAbstention.label} est le groupe qui s'abstient le plus souvent, dans ${plusAbstention.abstention}% des votes exprimés.` });
    }

    return items;
}

/**
 * "Comment votent les groupes" — répartition pour/contre/abstention de
 * chaque groupe politique, sur l'ensemble des scrutins de la législature.
 * Nouvelle stat catalogue `groupes.positions-de-vote` (scope aggregate,
 * shape multi-series) — voir `groupes.handlers.ts` /
 * `catalog/domains/groupes/registry.ts`. `StackedBarChartLib` est figé sur
 * les clés pour/contre/abstention, d'où la conversion depuis le shape
 * générique `multi-series` (`toStackedBarData`) plutôt qu'un passage direct.
 */
export const POSITIONS_DE_VOTE_SECTIONS: PageSection[] = [
    {
        id: "positions-de-vote-classement",
        label: "Comment votent les groupes",
        icon: PieChart,
        description: "Un même scrutin peut recevoir un \"pour\" massif d'un groupe et un \"contre\" tout aussi massif d'un autre — la répartition varie fortement d'un groupe à l'autre.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [stat, scrutinsTotal, votesTotal] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "positions-de-vote", { filters: { legislature: leg } }),
                statisticsGateway.fetchStat("scrutins", "total", { filters: { legislature: leg } }),
                statisticsGateway.fetchStat("votes", "total", { filters: { legislature: leg } }),
            ]);
            const rows = stat.shape === "multi-series" ? toStackedBarData(stat.series) : [];
            // Deux notions distinctes à ne pas confondre : le nombre de
            // SCRUTINS (votes solennels/publics organisés) vs le cumul de
            // VOTES individuels des député·es (pour+contre+abstention+non-
            // votant) — voir scrutins.handlers.ts "total" / votes.handlers.ts
            // "total".
            const totalScrutins = scrutinsTotal.shape === "scalar" ? scrutinsTotal.value : null;
            const totalVotes = votesTotal.shape === "scalar" ? votesTotal.value : null;

            return {
                "positions-recit": { legislature: leg, rows },
                "chart-positions-vote-groupes": { data: rows as unknown as MultiDatum[] },
                "kpi-scrutins-total-legislature": {
                    data: { value: totalScrutins ?? "—", label: `scrutins — ${leg}ᵉ législature` },
                },
                "kpi-votes-total-legislature": {
                    data: { value: totalVotes ?? "—", label: `votes cumulés — ${leg}ᵉ législature` },
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 2, config: card("kpi-scrutins-total-legislature") },
            { type: "card" as const, colSpan: 2, config: card("kpi-votes-total-legislature") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-positions-vote-groupes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "positions-recit",
                render: buildPositionsRecit,
            },
        ],
    },
];

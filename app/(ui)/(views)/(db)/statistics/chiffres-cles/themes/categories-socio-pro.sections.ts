import { Briefcase, Users, Scale } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { getPopulationFrancaiseProfessionFamillePct, getPopulationFrancaiseProfessionSource } from "@/app/domains/acteurs/constants/population-francaise-professions.constants";
import { card, chart, table, ProfessionPopulationTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

const NON_RENSEIGNEE = "Non renseignée";

type ProfessionItem = { label: string; value: number };
type ProfessionsRecitData = { legislature: number; items: ProfessionItem[]; total: number };

function pct(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
}

/**
 * Récit dynamique — la catégorie dominante et la moins représentée, "Non
 * renseignée" exclue des deux extrêmes (ce n'est pas une vraie catégorie
 * professionnelle, juste une donnée manquante) mais mentionnée à part si
 * elle pèse significativement, pour ne pas cacher un vrai trou de données.
 * Les catégories "populaires" (agriculteurs, ouvriers, sans profession
 * déclarée) ont leur propre section dédiée avec des KPI (voir plus bas),
 * pas juste une ligne noyée dans ce texte.
 */
function buildProfessionsRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as ProfessionsRecitData | undefined;
    if (!dto || dto.items.length === 0) return [{ type: "text", content: "Données indisponibles pour l'instant." }];

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature.` },
    ];

    const renseignees = dto.items.filter((i) => i.label !== NON_RENSEIGNEE);
    const nonRenseignee = dto.items.find((i) => i.label === NON_RENSEIGNEE);

    if (renseignees.length > 0) {
        const plusRepresentee = renseignees.reduce((best, i) => (i.value > best.value ? i : best), renseignees[0]);
        items.push({
            type: "highlight",
            content: `${plusRepresentee.label} est la catégorie la plus représentée, avec ${pct(plusRepresentee.value, dto.total)}% des député·es (${plusRepresentee.value}).`,
        });

        if (renseignees.length > 1) {
            const moinsRepresentee = renseignees.reduce((worst, i) => (i.value < worst.value ? i : worst), renseignees[0]);
            if (moinsRepresentee.label !== plusRepresentee.label) {
                items.push({
                    type: "text",
                    content: `À l'inverse, ${moinsRepresentee.label} est la moins représentée, avec ${pct(moinsRepresentee.value, dto.total)}% (${moinsRepresentee.value}).`,
                });
            }
        }
    }

    if (nonRenseignee && nonRenseignee.value > 0) {
        items.push({
            type: "text",
            content: `La catégorie professionnelle n'est pas renseignée pour ${pct(nonRenseignee.value, dto.total)}% des député·es (${nonRenseignee.value}).`,
        });
    }

    return items;
}

function findFamille(items: ProfessionItem[], label: string): ProfessionItem | undefined {
    return items.find((i) => i.label === label);
}

function kpiFromFamille(items: ProfessionItem[], total: number, legislature: number, label: string) {
    const item = findFamille(items, label);
    return {
        value: item ? `${pct(item.value, total)}%` : "0%",
        label: item ? `${label} (${item.value}) — ${legislature}ᵉ législature` : `${label} — ${legislature}ᵉ législature`,
    };
}

/**
 * "Fonctionnaires" n'est pas une famille à part dans `profession_famille`
 * (les agents publics sont répartis entre plusieurs familles selon leur
 * niveau de qualification) — seule `profession_categorie` (nomenclature
 * fine) le rend isolable, via les libellés contenant "fonction publique"
 * (ex: "Cadres administratifs et techniques de la fonction publique",
 * "Employés administratifs de la fonction publique, agents de service et
 * auxiliaires de santé").
 */
function kpiFonctionnaires(categorieItems: ProfessionItem[], total: number, legislature: number) {
    const value = categorieItems
        .filter((i) => i.label.includes("fonction publique"))
        .reduce((sum, i) => sum + i.value, 0);
    return {
        value: `${pct(value, total)}%`,
        label: `Fonctionnaires (${value}) — ${legislature}ᵉ législature`,
    };
}

/**
 * "Les catégories socio-professionnelles" — de quels horizons les
 * député·es viennent-ils/elles.
 *
 * Trois sections, deux granularités de la même vue `agg_acteurs_stats_professions` :
 * - `acteurs.professions` (`profession_categorie`, ~25 libellés fins propres
 *   à la nomenclature Assemblée) pour la répartition détaillée (donut).
 * - `acteurs.professions-famille` (`profession_famille`, ~8 grandes familles
 *   proches de la nomenclature INSEE) pour les KPI "catégories populaires"
 *   et la comparaison à la population EN EMPLOI française (pas "population
 *   active", ni la population générale — voir
 *   `population-francaise-professions.constants.ts`) — c'est le niveau
 *   auquel des % comparables sont réellement publiés, une donnée par
 *   législature (millésime Insee le plus proche de sa période).
 *
 * Voir `acteurs.handlers.ts` / `catalog/domains/acteurs/registry.ts`.
 */
export const CATEGORIES_SOCIO_PRO_SECTIONS: PageSection[] = [
    {
        id: "categories-socio-pro-repartition",
        label: "Les catégories socio-professionnelles",
        icon: Briefcase,
        description: "Avant d'être élu·es, les député·es exerçaient des métiers très divers — certaines catégories socio-professionnelles sont nettement plus représentées que d'autres à l'Assemblée.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const stat = await statisticsGateway.fetchStat("acteurs", "professions", { filters: { legislature: leg } });
            const items = stat.shape === "distribution" ? stat.items : [];
            const total = items.reduce((sum, i) => sum + i.value, 0);

            const renseignees = items.filter((i) => i.label !== NON_RENSEIGNEE);
            const dominante = renseignees.length > 0
                ? renseignees.reduce((best, i) => (i.value > best.value ? i : best), renseignees[0])
                : null;

            return {
                "profession-recit": { legislature: leg, items, total },
                "chart-categories-socio-pro-repartition": { data: items },
                "kpi-categorie-socio-pro-dominante": {
                    data: {
                        value: dominante ? `${pct(dominante.value, total)}%` : "—",
                        label: dominante ? `${dominante.label} — ${leg}ᵉ législature` : `Données indisponibles`,
                    },
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-categorie-socio-pro-dominante") },
            { type: "chart", colSpan: 3, config: chart("chart-categories-socio-pro-repartition") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "profession-recit",
                render: buildProfessionsRecit,
            },
        ],
    },
    {
        id: "categories-socio-pro-populaires",
        label: "Les catégories populaires, en repère",
        icon: Users,
        description: "Agriculteurs et ouvriers d'un côté, cadres et fonctionnaires de l'autre — des repères souvent cités pour juger si l'Assemblée reflète la diversité sociale du pays, sous- comme sur-représentation.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [familleStat, categorieStat] = await Promise.all([
                statisticsGateway.fetchStat("acteurs", "professions-famille", { filters: { legislature: leg } }),
                statisticsGateway.fetchStat("acteurs", "professions", { filters: { legislature: leg } }),
            ]);
            const familleItems = familleStat.shape === "distribution" ? familleStat.items : [];
            const familleTotal = familleItems.reduce((sum, i) => sum + i.value, 0);
            const categorieItems = categorieStat.shape === "distribution" ? categorieStat.items : [];
            const categorieTotal = categorieItems.reduce((sum, i) => sum + i.value, 0);

            return {
                "kpi-categorie-agriculteurs": { data: kpiFromFamille(familleItems, familleTotal, leg, "Agriculteurs exploitants") },
                "kpi-categorie-ouvriers": { data: kpiFromFamille(familleItems, familleTotal, leg, "Ouvriers") },
                "kpi-categorie-cadres": { data: kpiFromFamille(familleItems, familleTotal, leg, "Cadres et professions intellectuelles supérieures") },
                "kpi-categorie-fonctionnaires": { data: kpiFonctionnaires(categorieItems, categorieTotal, leg) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-categorie-agriculteurs") },
            { type: "card", colSpan: 1, config: card("kpi-categorie-ouvriers") },
            { type: "card", colSpan: 1, config: card("kpi-categorie-cadres") },
            { type: "card", colSpan: 1, config: card("kpi-categorie-fonctionnaires") },
        ],
    },
    {
        id: "categories-socio-pro-population",
        label: "Face à la population en emploi française",
        icon: Scale,
        description: "La composition socio-professionnelle de l'Assemblée, comparée à celle de la population EN EMPLOI française (Insee, enquête Emploi — un millésime par législature) — \"Pas de donnée\" pour une famille hors du périmètre de cette source (ex: retraités, structurellement hors population en emploi) ou pas encore renseignée.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const stat = await statisticsGateway.fetchStat("acteurs", "professions-famille", { filters: { legislature: leg } });
            const items = stat.shape === "distribution" ? stat.items : [];
            const total = items.reduce((sum, i) => sum + i.value, 0);

            const tableRows: ProfessionPopulationTableRow[] = items.map((item) => ({
                famille: item.label,
                pctAssemblee: pct(item.value, total),
                nbAssemblee: item.value,
                pctPopulation: getPopulationFrancaiseProfessionFamillePct(leg, item.label),
            }));

            return {
                "table-categories-socio-pro-population": tableRows,
                "population-source": { legislature: leg },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-categories-socio-pro-population"),
                title: "Assemblée vs population en emploi française, par famille socio-professionnelle",
                export: {
                    filenameBase: "categories-socio-pro-population-emploi",
                    csvColumns: [
                        { header: "Famille", value: (r) => r.famille },
                        { header: "% à l'Assemblée", value: (r) => `${r.pctAssemblee}%` },
                        { header: "Nombre à l'Assemblée", value: (r) => r.nbAssemblee },
                        { header: "% population en emploi française", value: (r) => (r.pctPopulation != null ? `${r.pctPopulation}%` : "Pas de donnée") },
                    ],
                },
            } satisfies SectionBlock<ProfessionPopulationTableRow>,
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "population-source",
                render: (data) => {
                    const dto = data as unknown as { legislature: number } | undefined;
                    const source = dto ? getPopulationFrancaiseProfessionSource(dto.legislature) : null;
                    if (!source) return [{ type: "text", content: "Source à venir pour cette législature." }];
                    return [{ type: "source", label: source.label, href: source.href }];
                },
            },
        ],
    },
];

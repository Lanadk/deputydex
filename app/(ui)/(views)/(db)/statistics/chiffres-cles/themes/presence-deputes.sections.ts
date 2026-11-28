import { CalendarDays, CalendarRange, Gauge, Users2 } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { MultiDatum, SeriesConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, chart, entityChart, table, GroupePresenceTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

type Item = { label: string; value: number };
type Series = { name: string; items: Item[] };
type StatData = Awaited<ReturnType<typeof statisticsGateway.fetchStat>>;

const itemsOf = (stat: StatData): Item[] => (stat.shape === "distribution" ? stat.items : []);
const pointsOf = (stat: StatData): Item[] => (stat.shape === "timeseries" ? stat.points : []);
const seriesOf = (stat: StatData): Series[] => (stat.shape === "multi-series" ? stat.series : []);

/**
 * Multi-séries du catalogue → données d'un graphique `bar-multi` : une ligne
 * par libellé, une colonne par série (même conversion que
 * `toMultiSeriesDataset` du mode avancé, libellés triés — d'où les préfixes
 * « 1 · Lundi », « 1 · Présence… » posés par les mappers du domaine presence).
 */
export function seriesToMultiDatum(series: Series[]): { data: MultiDatum[]; series: SeriesConfig[] } {
    const labels = Array.from(new Set(series.flatMap((s) => s.items.map((i) => i.label)))).sort((a, b) => a.localeCompare(b));
    return {
        series: series.map((s, i) => ({ dataKey: `s${i}`, label: s.name })),
        data: labels.map((label) => {
            const row: MultiDatum = { label };
            series.forEach((s, i) => {
                row[`s${i}`] = s.items.find((it) => it.label === label)?.value ?? null;
            });
            return row;
        }),
    };
}

/** « 1 · Présence (…) » → « Présence (…) » : le préfixe d'ordre n'a pas à s'afficher. */
const sansPrefixe = (label: string) => label.replace(/^\d+ · /, "");

function toGroupCardData(code: string, cards: GroupeCardDTO[], caption: string): GroupCardData {
    const found = cards.find((c) => c.groupeCode === code);
    return {
        code,
        libelle: found?.groupeLabel ?? code,
        nbMembers: found?.groupeCountMembers,
        president: found?.groupePresidentFullName,
        sexPresidentType: found?.groupeQualitySexLabel,
        image: found?.groupeImg,
        href: found?.groupeHref ?? `/groupes/${code}`,
        caption,
    };
}

const METHODE =
    "Un jour est « attendu » quand une séance publique avec au moins un scrutin public s'est tenue pendant le " +
    "mandat, ou quand le député est convoqué à une réunion d'un organe (commission…) dont il est membre. Il est " +
    "« présent » s'il a voté personnellement (hors délégation), pris la parole en séance ou été noté présent en " +
    "commission. C'est une borne basse : un député assis dans l'hémicycle qui ne vote ni ne parle n'est pas vu.";

/**
 * "La présence des député·es" — vues `agg_*_presence*` de deputydex-data
 * (démarche dans `deputydex-data/src/sql/scripts/presence/README.md`), via
 * les mêmes stats catalogue que le mode avancé (`legislatures.presence-*`,
 * `groupes.presence-*`) : législature du sélecteur global, sauf les années
 * (toutes législatures, une année civile pouvant chevaucher deux législatures).
 */
export const PRESENCE_DEPUTES_SECTIONS: PageSection[] = [
    {
        id: "presence-vue-ensemble",
        label: "La présence à l'Assemblée",
        icon: Gauge,
        description: METHODE,
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const filters = { filters: { legislature: leg } };
            const [composantes, evolution, jours] = await Promise.all([
                statisticsGateway.fetchStat("legislatures", "presence-composantes", filters),
                statisticsGateway.fetchStat("legislatures", "presence-evolution", filters),
                statisticsGateway.fetchStat("legislatures", "presence-jours-mensuels", filters),
            ]);

            const series = seriesOf(composantes).map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, label: sansPrefixe(i.label) })) }));
            const valeur = (prefixe: string) => series[0]?.items.find((i) => i.label.startsWith(prefixe))?.value;
            const pct = (v: number | undefined) => (v != null ? `${v}%` : "—");
            const joursPoints = pointsOf(jours);
            const moyenneJours = joursPoints.length > 0
                ? Math.round((joursPoints.reduce((s, p) => s + p.value, 0) / joursPoints.length) * 10) / 10
                : null;

            return {
                "kpi-presence-taux": { data: { label: `taux de présence — ${leg}ᵉ législature`, value: pct(valeur("Présence")) } },
                "kpi-presence-seance": { data: { label: "présence en séance (jours avec scrutin)", value: pct(valeur("En séance")) } },
                "kpi-presence-commission": { data: { label: "présence en commission (membres convoqués)", value: pct(valeur("En commission")) } },
                "kpi-presence-jours-par-mois": { data: { label: "jours de présence par mois, en moyenne", value: moyenneJours ?? "—" } },
                "chart-presence-composantes": seriesToMultiDatum(series),
                "chart-presence-evolution": { data: pointsOf(evolution) },
                "chart-presence-jours-mensuels": { data: joursPoints },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 1, config: card("kpi-presence-taux") },
            { type: "card" as const, colSpan: 1, config: card("kpi-presence-seance") },
            { type: "card" as const, colSpan: 1, config: card("kpi-presence-commission") },
            { type: "card" as const, colSpan: 1, config: card("kpi-presence-jours-par-mois") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-composantes") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-evolution") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-jours-mensuels") },
        ],
    },
    {
        id: "presence-rythme",
        label: "Le rythme de la semaine parlementaire",
        icon: CalendarDays,
        description:
            "Mardi et mercredi concentrent les votes solennels et les questions au Gouvernement : la présence y " +
            "est la plus forte. Le lundi et le vendredi, beaucoup de député·es sont en circonscription. Jour par " +
            "jour : part des député·es en mandat présent·es en séance, les jours de séance avec au moins un scrutin public.",
        cols: 4,
        lazy: true,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const filters = { filters: { legislature: legislature as number } };
            const [semaine, journaliere] = await Promise.all([
                statisticsGateway.fetchStat("legislatures", "presence-jour-semaine", filters),
                statisticsGateway.fetchStat("legislatures", "presence-journaliere", filters),
            ]);
            const series = seriesOf(semaine).map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, label: sansPrefixe(i.label) })) }));
            // Après retrait du préfixe, l'ordre lundi → dimanche doit être
            // repris de la série d'origine (le tri alphabétique le casserait).
            const ordre = seriesOf(semaine)[0]?.items.map((i) => sansPrefixe(i.label)) ?? [];
            const dataset = seriesToMultiDatum(series);
            dataset.data.sort((a, b) => ordre.indexOf(String(a.label)) - ordre.indexOf(String(b.label)));

            return {
                "chart-presence-jour-semaine": dataset,
                "chart-presence-journaliere": { data: pointsOf(journaliere) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-jour-semaine") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-journaliere") },
        ],
    },
    {
        id: "presence-groupes",
        label: "Groupe par groupe",
        icon: Users2,
        description:
            "Chaque jour compte pour le groupe du député CE JOUR-LÀ (un changement de groupe en cours de " +
            "législature est suivi). Taux pondéré : somme des jours présents ÷ somme des jours attendus de tous " +
            "les membres. Non inscrits exclus du classement.",
        cols: 4,
        lazy: true,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const filters = { filters: { legislature: leg } };
            const [taux, jours, annees, cards, groupes] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "presence", filters),
                statisticsGateway.fetchStat("groupes", "presence-jours-par-mois", filters),
                statisticsGateway.fetchStat("groupes", "presence-annee-parlementaire", filters),
                groupesGateways.getGroupesCards(leg),
                groupesGateways.getGroupesList(leg),
            ]);
            const joursParGroupe = new Map(itemsOf(jours).map((i) => [i.label, i.value]));

            const rows: GroupePresenceTableRow[] = itemsOf(taux).map((item, i) => ({
                groupeCode: item.label,
                groupeLabel: cards.find((c) => c.groupeCode === item.label)?.groupeLabel ?? item.label,
                tauxPresence: item.value,
                joursParMois: joursParGroupe.get(item.label) ?? null,
                rank: i + 1,
            }));
            const premier = rows[0];
            const dernier = rows.length > 1 ? rows[rows.length - 1] : undefined;
            const extremes = [
                premier && toGroupCardData(premier.groupeCode, cards, "Le plus présent"),
                dernier && toGroupCardData(dernier.groupeCode, cards, "Le moins présent"),
            ].filter((c): c is GroupCardData => !!c);

            return {
                "card-groupes-presence-extremes": { data: { cards: extremes } },
                "table-presence-groupes": rows,
                "entity-chart-presence-groupe": { entities: groupes.map((g) => ({ code: g.code, label: g.label })) },
                "chart-presence-groupes-annee-parlementaire": seriesToMultiDatum(seriesOf(annees)),
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-presence-extremes") },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-presence-groupes"),
                title: "Classement des groupes par taux de présence",
                export: {
                    filenameBase: "presence-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Taux de présence", value: (r) => `${r.tauxPresence}%` },
                        { header: "Jours de présence / mois", value: (r) => r.joursParMois ?? "" },
                    ],
                },
            } satisfies SectionBlock<GroupePresenceTableRow>,
            { type: "entity-chart" as const, colSpan: 4, config: entityChart("entity-chart-presence-groupe") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-groupes-annee-parlementaire") },
        ],
    },
    {
        id: "presence-annees",
        label: "Année après année",
        icon: CalendarRange,
        description:
            "Jours de présence (toutes sources, attendus ou non, un jour compté une fois) divisés par les mois " +
            "actifs (mois avec une séance ou un jour attendu, août exclu) : une année entamée reste comparable à " +
            "une année complète. L'année parlementaire suit les sessions (1er octobre → 30 septembre). Toutes " +
            "législatures : 2024 relève de la 16ᵉ puis de la 17ᵉ, d'où un libellé par législature. La présence " +
            "par année de mandat se consulte député par député dans les Statistiques avancées.",
        cols: 4,
        lazy: true,
        gatewayFn: async () => {
            const [parlementaire, civile] = await Promise.all([
                statisticsGateway.fetchStat("legislatures", "presence-annee-parlementaire", {}),
                statisticsGateway.fetchStat("legislatures", "presence-annee-civile", {}),
            ]);
            return {
                "chart-presence-annee-parlementaire": { data: pointsOf(parlementaire) },
                "chart-presence-annee-civile": { data: pointsOf(civile) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-annee-parlementaire") },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-annee-civile") },
        ],
    },
];

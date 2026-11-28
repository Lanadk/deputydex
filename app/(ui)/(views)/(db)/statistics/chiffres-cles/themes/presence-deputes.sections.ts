import { CalendarDays, CalendarRange, Gauge, Users2 } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { MultiDatum, SeriesConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, chart, entityChart, table, GroupePresenceTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";
import { F_PRESENCE_ANNEE_CIVILE, F_PRESENCE_ANNEE_MANDAT, F_PRESENCE_ANNEE_PARLEMENTAIRE, F_PRESENCE_COMMISSION, F_PRESENCE_DEPUTES_PRESENTS, F_PRESENCE_GROUPE, F_PRESENCE_GROUPE_ANNEE, F_PRESENCE_GROUPE_COMMISSION, F_PRESENCE_GROUPE_EXCUSES, F_PRESENCE_GROUPE_JOURS, F_PRESENCE_GROUPE_MOIS, F_PRESENCE_GROUPE_SCRUTINS, F_PRESENCE_GROUPE_SEANCE, F_PRESENCE_JOUR_SEANCE, F_PRESENCE_JOUR_SEMAINE, F_PRESENCE_JOUR_TOUS_LIEUX, F_PRESENCE_JOURS_MOIS, F_PRESENCE_SCRUTINS, F_PRESENCE_SEANCE, F_PRESENCE_TAUX, F_PRESENCE_TAUX_MOIS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/participation-presence.formules";

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
 * les mêmes stats catalogue que le mode avancé (`acteurs.presence-moyenne-*`,
 * `groupes.presence-*`), sur la législature du sélecteur global. Affichées
 * dans le thème « Participation & présence », après le volet participation.
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
                statisticsGateway.fetchStat("acteurs", "presence-moyenne", filters),
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-evolution", filters),
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-jours-mensuels", filters),
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
            // Une seule rangée de 4 KPI : un accordéon sur toute la largeur, pas un sous chaque KPI.
            { type: "formulas" as const, colSpan: 4, formulas: [F_PRESENCE_TAUX, F_PRESENCE_SEANCE, F_PRESENCE_COMMISSION, F_PRESENCE_JOURS_MOIS] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-composantes"), formulas: [F_PRESENCE_TAUX, F_PRESENCE_SEANCE, F_PRESENCE_COMMISSION, F_PRESENCE_SCRUTINS] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-evolution"), formulas: [F_PRESENCE_TAUX_MOIS] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-jours-mensuels"), formulas: [F_PRESENCE_JOURS_MOIS] },
        ],
    },
    {
        id: "presence-rythme",
        label: "Le rythme de la semaine parlementaire",
        icon: CalendarDays,
        description:
            "Mardi et mercredi concentrent les votes solennels et les questions au Gouvernement : la présence y " +
            "est la plus forte. Le lundi et le vendredi, beaucoup de député·es sont en circonscription. Jour par " +
            "jour, les jours de séance avec au moins un scrutin public : part des député·es en mandat présent·es en séance, " +
            "part des député·es attendu·es présent·es en séance ou en commission, et nombre de député·es vu·es présent·es.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const filters = { filters: { legislature: legislature as number } };
            const [semaine, journaliere, presents] = await Promise.all([
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-jour-semaine", filters),
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-journaliere", filters),
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-deputes-presents", filters),
            ]);
            const series = seriesOf(semaine).map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, label: sansPrefixe(i.label) })) }));
            // Après retrait du préfixe, l'ordre lundi → dimanche doit être
            // repris de la série d'origine (le tri alphabétique le casserait).
            const ordre = seriesOf(semaine)[0]?.items.map((i) => sansPrefixe(i.label)) ?? [];
            const dataset = seriesToMultiDatum(series);
            dataset.data.sort((a, b) => ordre.indexOf(String(a.label)) - ordre.indexOf(String(b.label)));

            return {
                "chart-presence-jour-semaine": dataset,
                "chart-presence-journaliere": seriesToMultiDatum(seriesOf(journaliere)),
                "chart-presence-deputes-presents": { data: pointsOf(presents) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-jour-semaine"), formulas: [F_PRESENCE_JOUR_SEMAINE] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-journaliere"), formulas: [F_PRESENCE_JOUR_SEANCE, F_PRESENCE_JOUR_TOUS_LIEUX] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-deputes-presents"), formulas: [F_PRESENCE_DEPUTES_PRESENTS] },
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
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const filters = { filters: { legislature: leg } };
            const [taux, jours, composantes, annees, cards, groupes] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "presence", filters),
                statisticsGateway.fetchStat("groupes", "presence-jours-par-mois", filters),
                statisticsGateway.fetchStat("groupes", "presence-composantes", filters),
                statisticsGateway.fetchStat("groupes", "presence-annee-parlementaire", filters),
                groupesGateways.getGroupesCards(leg),
                groupesGateways.getGroupesList(leg),
            ]);
            const joursParGroupe = new Map(itemsOf(jours).map((i) => [i.label, i.value]));
            // Une série par composante (« 1 · En séance »…), un item par groupe (label = CODE).
            const parComposante = seriesOf(composantes).map((s) => ({ name: sansPrefixe(s.name), items: s.items }));
            const composante = (nom: string, code: string) =>
                parComposante.find((s) => s.name === nom)?.items.find((i) => i.label === code)?.value ?? null;

            const rows: GroupePresenceTableRow[] = itemsOf(taux).map((item, i) => ({
                groupeCode: item.label,
                groupeLabel: cards.find((c) => c.groupeCode === item.label)?.groupeLabel ?? item.label,
                tauxPresence: item.value,
                tauxSeance: composante("En séance", item.label),
                tauxCommission: composante("En commission", item.label),
                tauxScrutins: composante("Participation aux scrutins", item.label),
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
                // Mêmes groupes que le tableau (les vues ne renvoient pas les Non inscrits).
                "chart-presence-groupes-composantes": seriesToMultiDatum(parComposante),
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
                formulas: [F_PRESENCE_GROUPE, F_PRESENCE_GROUPE_SEANCE, F_PRESENCE_GROUPE_COMMISSION, F_PRESENCE_GROUPE_SCRUTINS, F_PRESENCE_GROUPE_JOURS],
                export: {
                    filenameBase: "presence-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Taux de présence", value: (r) => `${r.tauxPresence}%` },
                        { header: "En séance", value: (r) => (r.tauxSeance != null ? `${r.tauxSeance}%` : "") },
                        { header: "En commission", value: (r) => (r.tauxCommission != null ? `${r.tauxCommission}%` : "") },
                        { header: "Scrutins", value: (r) => (r.tauxScrutins != null ? `${r.tauxScrutins}%` : "") },
                        { header: "Jours de présence / mois", value: (r) => r.joursParMois ?? "" },
                    ],
                },
            } satisfies SectionBlock<GroupePresenceTableRow>,
            {
                type: "chart" as const,
                colSpan: 4,
                config: chart("chart-presence-groupes-composantes"),
                formulas: [F_PRESENCE_GROUPE_SEANCE, F_PRESENCE_GROUPE_COMMISSION, F_PRESENCE_GROUPE_EXCUSES, F_PRESENCE_GROUPE_SCRUTINS],
            },
            { type: "entity-chart" as const, colSpan: 4, config: entityChart("entity-chart-presence-groupe"), formulas: [F_PRESENCE_GROUPE_MOIS] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-groupes-annee-parlementaire"), formulas: [F_PRESENCE_GROUPE_ANNEE] },
        ],
    },
    {
        id: "presence-annees",
        label: "Année après année",
        icon: CalendarRange,
        description:
            "Année parlementaire : 1er octobre → 30 septembre, comme les sessions (juillet–septembre 2024, début de " +
            "la 17ᵉ, relève de « 2023-2024 »). Année de mandat : rang de l'année dans le mandat de chaque député, " +
            "depuis sa propre prise de fonction. Année civile : jours de présence (toutes sources, attendus ou non) " +
            "divisés par les mois actifs (août exclu), pour qu'une année entamée reste comparable à une année complète.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const filters = { filters: { legislature: legislature as number } };
            const [parlementaire, mandat, civile] = await Promise.all([
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-taux-annee-parlementaire", filters),
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-taux-annee-mandat", filters),
                statisticsGateway.fetchStat("acteurs", "presence-moyenne-jours-annee-civile", filters),
            ]);
            return {
                "chart-presence-annee-parlementaire": { data: pointsOf(parlementaire) },
                "chart-presence-annee-mandat": { data: pointsOf(mandat) },
                "chart-presence-annee-civile": { data: pointsOf(civile) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart" as const, colSpan: 2, config: chart("chart-presence-annee-parlementaire"), formulas: [F_PRESENCE_ANNEE_PARLEMENTAIRE] },
            { type: "chart" as const, colSpan: 2, config: chart("chart-presence-annee-mandat"), formulas: [F_PRESENCE_ANNEE_MANDAT] },
            { type: "chart" as const, colSpan: 4, config: chart("chart-presence-annee-civile"), formulas: [F_PRESENCE_ANNEE_CIVILE] },
        ],
    },
];

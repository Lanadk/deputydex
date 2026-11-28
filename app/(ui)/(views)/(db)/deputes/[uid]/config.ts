import { BookOpen, CalendarDays, Gauge, Landmark, Vote } from "lucide-react";
import { activityCalendar, card, chart, dossierList, table } from "@/app/(ui)/(views)/(db)/deputes/[uid]/registry";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { MultiDatum, SeriesConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { formatDateOnlyFr } from "@/app/_shared/utils/date";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import {
    F_COMPARAISON,
    F_DEPUTE_ANNEE_MANDAT,
    F_DEPUTE_COMMISSION,
    F_DEPUTE_JOURS_MOIS,
    F_DEPUTE_SCRUTINS,
    F_DEPUTE_SEANCE,
    F_DEPUTE_SOURCES,
    F_DEPUTE_TAUX,
    F_DEPUTE_TAUX_MOIS,
} from "@/app/(ui)/(views)/(db)/deputes/[uid]/presence.formules";

// ── Présence : lecture des stats catalogue ──────────────────────────────────

type Item = { label: string; value: number };

/** Une stat en échec ne fait pas tomber toute la section : elle s'affiche vide. */
const lireStat = (p: Promise<RawStatData>): Promise<RawStatData | null> => p.catch(() => null);
const pointsOf = (s: RawStatData | null): Item[] => (s?.shape === "timeseries" ? s.points : []);
const seriesOf = (s: RawStatData | null) => (s?.shape === "multi-series" ? s.series : []);
const itemsOf = (s: RawStatData | null): Item[] => (s?.shape === "distribution" ? s.items : []);

/** « 1 · En séance » → « En séance » ; « 17ᵉ · année 1 » → « année 1 ». */
const sansPrefixe = (label: string) => label.replace(/^(\d+ · |\d+ᵉ · )/, "");

/** Composantes affichées, dans cet ordre ; clé = libellé sans préfixe des stats `*-composantes` / `presence-moyenne`. */
const COMPOSANTES = [
    { cle: "Présence (tous jours attendus)", libelle: "Taux de présence" },
    { cle: "En séance", libelle: "En séance" },
    { cle: "En commission", libelle: "En commission" },
    { cle: "Excusés en commission", libelle: "Excusé en commission" },
    { cle: "Participation aux scrutins", libelle: "Scrutins" },
];

/** Première série d'une stat composantes (une seule législature) → valeur par composante. */
function valeursComposantes(stat: RawStatData | null): Map<string, number> {
    return new Map((seriesOf(stat)[0]?.items ?? []).map((i) => [sansPrefixe(i.label), i.value]));
}

/** `groupes.presence-composantes` (une série par composante, un item par groupe) → valeurs du groupe `code`. */
function valeursGroupe(composantes: RawStatData | null, global: RawStatData | null, code: string | null): Map<string, number> {
    const valeurs = new Map<string, number>();
    if (!code) return valeurs;
    for (const s of seriesOf(composantes)) {
        const v = s.items.find((i) => i.label === code)?.value;
        if (v != null) valeurs.set(sansPrefixe(s.name), v);
    }
    const taux = itemsOf(global).find((i) => i.label === code)?.value;
    if (taux != null) valeurs.set("Présence (tous jours attendus)", taux);
    return valeurs;
}

/** Graphique de comparaison : une ligne par composante, une colonne par population (ordre fixe, pas de tri). */
function comparaison(populations: { nom: string; valeurs: Map<string, number> }[]): { data: MultiDatum[]; series: SeriesConfig[] } {
    const presentes = populations.filter((p) => p.valeurs.size > 0);
    return {
        series: presentes.map((p, i) => ({ dataKey: `s${i}`, label: p.nom })),
        data: COMPOSANTES.map(({ cle, libelle }) => {
            const row: MultiDatum = { label: libelle };
            presentes.forEach((p, i) => {
                row[`s${i}`] = p.valeurs.get(cle) ?? null;
            });
            return row;
        }),
    };
}

const pct = (v: number | undefined) => (v != null ? `${v}%` : "—");

function avertissementPresence(note: string | undefined): ParagraphItem[] {
    return [
        {
            type: "callout",
            variant: "warning",
            title: "Une estimation, pas un pointage",
            paragraphs: [
                ...(note ? [note + "."] : []),
                "L'Assemblée ne publie pas de registre de présence : ces chiffres sont reconstitués à partir des votes, " +
                    "des prises de parole en séance et des listes de présence des commissions. Ils sous-estiment la " +
                    "présence (un député assis qui ne vote ni ne parle n'est pas vu) et ignorent le travail en " +
                    "circonscription. Le calcul exact est sous chaque graphique.",
            ],
        },
    ];
}

export const DEPUTE_SECTIONS: PageSection[] = [
    // ── Activité ────────────────────────────────────────────────────────────
    {
        id: "activite-calendrier",
        label: "Activité",
        icon: CalendarDays,
        description: "Jours d'activité du député sur cette législature (votes, amendements déposés ou co-signés)",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const data = await deputesGateway.getDeputeActivityCalendar(uid as string, legislature as number);
            return { "depute-activity-calendar": { data } } as Record<string, BlockDataWrapper>;
        },
        actions: {
            onActivityClick: async ({ date, uid, legislature }) => {
                return deputesGateway.getDeputeActivityCalendarDetails(
                    uid as string,
                    legislature as number,
                    date
                );
            },
        },
        blocks: [
            {
                type: "activity-calendar",
                colSpan: 4,
                config: activityCalendar("depute-activity-calendar"),
            },
        ],
    },

    // ── Présence ────────────────────────────────────────────────────────────
    // Législature du sélecteur : mêmes stats que le mode avancé
    // (`acteurs.presence-*`, filtre législature), comparées à son groupe du
    // moment (`groupes.presence*`) et à toute l'Assemblée (`acteurs.presence-moyenne`).
    {
        id: "presence",
        label: "Présence",
        icon: Gauge,
        description: "En séance, en commission et aux scrutins sur cette législature, comparé à son groupe et à l'ensemble des députés",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const depute = { entityId: uid as string, filters: { legislature: leg } };
            const legislatureSeule = { filters: { legislature: leg } };

            const [composantes, evolution, jours, sources, mandat, assemblee, groupesComposantes, groupesTaux, identite] = await Promise.all([
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-composantes", depute)),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence", depute)),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-jours-mensuels", depute)),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-sources", depute)),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-annee-mandat", depute)),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-moyenne", legislatureSeule)),
                lireStat(statisticsGateway.fetchStat("groupes", "presence-composantes", legislatureSeule)),
                lireStat(statisticsGateway.fetchStat("groupes", "presence", legislatureSeule)),
                deputesGateway.getDeputeIdentity(uid as string, leg).catch(() => null),
            ]);

            const valeurs = valeursComposantes(composantes);
            const groupeCode = identite?.groupeCode ?? null;

            return {
                "presence-avertissement": { note: composantes?.note },
                "kpi-presence-taux": { data: { label: "taux de présence", value: pct(valeurs.get("Présence (tous jours attendus)")) } },
                "kpi-presence-seance": { data: { label: "présence en séance", value: pct(valeurs.get("En séance")) } },
                "kpi-presence-commission": { data: { label: "présence en commission", value: pct(valeurs.get("En commission")) } },
                "kpi-presence-scrutins": { data: { label: "participation aux scrutins", value: pct(valeurs.get("Participation aux scrutins")) } },
                "chart-presence-comparaison": comparaison([
                    { nom: "Ce député", valeurs },
                    { nom: groupeCode ? `Groupe ${groupeCode}` : "Son groupe", valeurs: valeursGroupe(groupesComposantes, groupesTaux, groupeCode) },
                    { nom: "Assemblée", valeurs: valeursComposantes(assemblee) },
                ]),
                "chart-presence-evolution": { data: pointsOf(evolution) },
                "chart-presence-jours-mensuels": { data: pointsOf(jours) },
                "chart-presence-sources": {
                    data: (seriesOf(sources)[0]?.items ?? []).map((i) => ({ label: sansPrefixe(i.label), value: i.value })),
                },
                "chart-presence-annee-mandat": { data: pointsOf(mandat).map((p) => ({ label: sansPrefixe(p.label), value: p.value })) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "presence-avertissement",
                render: (data) => avertissementPresence((data as { note?: string } | undefined)?.note),
            },
            { type: "card", colSpan: 1, config: card("kpi-presence-taux") },
            { type: "card", colSpan: 1, config: card("kpi-presence-seance") },
            { type: "card", colSpan: 1, config: card("kpi-presence-commission") },
            { type: "card", colSpan: 1, config: card("kpi-presence-scrutins") },
            // Rangée de 4 KPI : un seul accordéon sur toute la largeur.
            { type: "formulas", colSpan: 4, formulas: [F_DEPUTE_TAUX, F_DEPUTE_SEANCE, F_DEPUTE_COMMISSION, F_DEPUTE_SCRUTINS] },
            { type: "chart", colSpan: 4, config: chart("chart-presence-comparaison"), formulas: [F_COMPARAISON] },
            { type: "chart", colSpan: 2, config: chart("chart-presence-evolution"), formulas: [F_DEPUTE_TAUX_MOIS] },
            { type: "chart", colSpan: 2, config: chart("chart-presence-jours-mensuels"), formulas: [F_DEPUTE_JOURS_MOIS] },
            { type: "chart", colSpan: 2, config: chart("chart-presence-sources"), formulas: [F_DEPUTE_SOURCES] },
            { type: "chart", colSpan: 2, config: chart("chart-presence-annee-mandat"), formulas: [F_DEPUTE_ANNEE_MANDAT] },
        ],
    },

    // ── Comportement au vote & activité législative ────────────────────────────
    {
        id: "votes-activite",
        label: "Comportement au vote et activité législative",
        icon: Vote,
        description: "Participation, fidélité au groupe, votes rebelles, ainsi que les amendements déposés et adoptés sur cette législature",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const [stats, recentVotes, amendementStats] = await Promise.all([
                deputesGateway.getDeputeVoteStats(uid as string, legislature as number),
                deputesGateway.getDeputeRecentVotes(uid as string, legislature as number),
                deputesGateway.getDeputeAmendementStats(uid as string, legislature as number),
            ]);

            return {
                "kpi-vote-participation": {
                    data: {
                        label: "taux de participation",
                        value: stats.tauxParticipation !== null ? `${stats.tauxParticipation}%` : "—",
                    },
                },
                "kpi-vote-fidelite": {
                    data: {
                        label: "fidélité au groupe",
                        value: stats.tauxFidelite !== null ? `${stats.tauxFidelite}%` : "—",
                    },
                },
                "kpi-vote-rebel": {
                    data: {
                        label: "votes rebelles",
                        value: stats.rebelVotesCount,
                    },
                },
                "kpi-vote-total": {
                    data: {
                        label: "scrutins sur cette législature",
                        value: stats.totalVotes,
                    },
                },
                "kpi-vote-breakdown": {
                    data: {
                        title: "Répartition des votes",
                        maxValue: stats.totalVotes,
                        items: [
                            { label: "Pour", value: stats.totalPour, color: "#22c55e" },
                            { label: "Contre", value: stats.totalContre, color: "#ef4444" },
                            { label: "Abstention", value: stats.totalAbstentions, color: "#f59e0b" },
                            { label: "Non-votant", value: stats.totalNonVotants, color: "#94a3b8" },
                        ],
                    },
                },
                "chart-vote-positions": {
                    type: "donut",
                    data: [
                        { label: "Pour", value: stats.totalPour },
                        { label: "Contre", value: stats.totalContre },
                        { label: "Abstention", value: stats.totalAbstentions },
                        { label: "Non-votant", value: stats.totalNonVotants },
                    ],
                },
                "depute-recent-votes-table": recentVotes,
                "kpi-amendements-deposes": {
                    data: { label: "amendements déposés", value: amendementStats.totalDepose },
                },
                "kpi-amendements-adoptes": {
                    data: { label: "amendements adoptés", value: amendementStats.totalAdopte },
                },
                "kpi-amendements-taux": {
                    data: { label: "taux d'adoption", value: `${amendementStats.tauxAdoption}%` },
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-vote-total") },
            { type: "card", colSpan: 1, config: card("kpi-vote-participation") },
            { type: "card", colSpan: 1, config: card("kpi-vote-fidelite") },
            { type: "card", colSpan: 1, config: card("kpi-vote-rebel") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-deposes") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-adoptes") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-taux") },
            { type: "card", colSpan: 2, config: card("kpi-vote-breakdown") },
            { type: "chart", colSpan: 2, config: chart("chart-vote-positions") },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("depute-recent-votes-table"),
            } satisfies SectionBlock<DeputeRecentVoteDTO>,
        ],
    },

    // ── Mandats ─────────────────────────────────────────────────────────────
    {
        id: "mandats",
        label: "Historique des mandats",
        icon: BookOpen,
        description: "Tous les mandats exercés par ce député au fil de sa carrière politique",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid }: Record<string, unknown>) => {
            const mandats = await deputesGateway.getDeputeMandats(uid as string);
            return { "depute-mandats-table": mandats } as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("depute-mandats-table"),
            } satisfies SectionBlock<DeputeMandatDTO>,
        ],
    },

    // ── Dossiers législatifs ───────────────────────────────────────────────
    {
        id: "dossiers-legislatifs",
        label: "Dossiers législatifs",
        icon: Landmark,
        description: "Les textes de loi auxquels ce député a contribué sur cette législature : amendements déposés, adoptés ou co-signés, rôle de rapporteur ou d'auteur",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            // Une section en échec bloquerait toute la fiche (useFetchSectionData ne gère pas
            // les rejets) : on retombe sur une liste vide plutôt que de figer la page.
            const dossiers = await deputesGateway
                .getDeputeDossierContributions(uid as string, legislature as number)
                .catch((error) => {
                    console.error("Dossiers législatifs indisponibles :", error);
                    return [];
                });
            return { "depute-dossiers-list": dossiers } as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "expandable-card-list" as const,
                colSpan: 4,
                config: {
                    ...dossierList("depute-dossiers-list"),
                    loadItems: async (r, { uid, legislature }) => {
                        const amendements = await deputesGateway.getDeputeDossierAmendements(
                            uid as string,
                            legislature as number,
                            r.dossierUid
                        );
                        return amendements.map((a) => ({
                            id: a.uid,
                            label: a.numero ? `n° ${a.numero}` : "Amendement",
                            group: a.texte.libelle,
                            context: a.division,
                            status: a.statut,
                            tone: a.isAdopte ? "success" : "neutral",
                            date: formatDateOnlyFr(a.dateDepot),
                            summary: a.exposeSommaire,
                            href: a.lienAN,
                        }));
                    },
                },
            } satisfies SectionBlock<DeputeDossierContributionDTO>,
        ],
    },
];

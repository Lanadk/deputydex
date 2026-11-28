import { BookOpen, CalendarDays, CalendarRange, FileText, Gauge, History, Landmark, ListChecks, TrendingUp, Vote } from "lucide-react";
import { activityCalendar, card, chart, dossierList, table } from "@/app/(ui)/(views)/(db)/deputes/[uid]/registry";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { TabDefinition } from "@/app/(ui)/component-library/template/sections/tab-section/tab.types";
import { BlockDataWrapper, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import {
    avertissementPresence,
    comparaison,
    lireStat,
    pct,
    pointsOf,
    sansPrefixe,
    seriesOf,
    valeursComposantes,
    valeursGroupe,
} from "@/app/(ui)/_shared/statistics/presence/presence-section.helpers";
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
import { F_DEPUTE_PARTICIPATION_VOTES } from "@/app/(ui)/(views)/(db)/deputes/[uid]/votes.formules";
import { F_DEPUTE_SCORE, scoreDeputeApercu, verdictScore } from "@/app/(ui)/(views)/(db)/deputes/[uid]/score";

// ── Activité ────────────────────────────────────────────────────────────────
// Calendrier d'activité et score du député : le score à gauche du calendrier,
// son détail sous le calendrier. Score : maquette (`scoreDeputeApercu`, voir score.ts)
// en attendant les données de deputydex-data.

const ACTIVITE: PageSection[] = [
    {
        id: "activite-calendrier",
        label: "Activité et score",
        icon: CalendarDays,
        description: "Jours d'activité du député sur cette législature (votes, amendements déposés ou co-signés), et son score pour en avoir une première idée",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const [data, score] = await Promise.all([
                deputesGateway.getDeputeActivityCalendar(uid as string, legislature as number),
                Promise.resolve(scoreDeputeApercu()),
            ]);
            return {
                "depute-activity-calendar": { data },
                "card-score-depute": {
                    data: {
                        title: "Score",
                        score: score.score,
                        verdict: verdictScore(score.score),
                        caption: score.percentile != null ? `Mieux que ${score.percentile} % des députés de la législature` : undefined,
                        badge: score.apercu ? "Aperçu" : undefined,
                        badges: score.badges,
                    },
                },
                "card-score-detail": {
                    data: {
                        title: "Détail du score",
                        items: score.composantes,
                        footer: score.apercu
                            ? "Aperçu : composantes, poids et valeurs fictifs, en attendant le calcul réel du score."
                            : "Chaque composante apporte poids × sous-score ÷ 100 points ; leur somme donne le score.",
                    },
                },
            } as unknown as Record<string, BlockDataWrapper>;
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
            // Score à gauche, sur la hauteur du calendrier ET du détail (2 rangées) ;
            // calendrier sur 3 colonnes à sa droite, détail du score dessous.
            // Score : maquette floutée « Disponible bientôt » tant que les données n'existent pas.
            { type: "card", colSpan: 1, rowSpan: 2, config: card("card-score-depute"), bientot: true },
            {
                type: "activity-calendar",
                colSpan: 3,
                config: activityCalendar("depute-activity-calendar"),
            },
            { type: "card", colSpan: 3, config: card("card-score-detail"), formulas: [F_DEPUTE_SCORE], bientot: true },
        ],
    },
];

// ── Présence ────────────────────────────────────────────────────────────────
// Législature du sélecteur : mêmes stats que le mode avancé
// (`acteurs.presence-*`, filtre législature), comparées à son groupe du
// moment (`groupes.presence*`) et à toute l'Assemblée (`acteurs.presence-moyenne`).
// Chaque sous-thème charge ses seules stats.

const statDepute = (uid: unknown, legislature: unknown) => ({ entityId: uid as string, filters: { legislature: legislature as number } });

const PRESENCE: PageSection[] = [
    {
        id: "presence-synthese",
        label: "Synthèse",
        icon: Gauge,
        description: "En séance, en commission et aux scrutins sur cette législature, comparé à son groupe et à l'ensemble des députés",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const legislatureSeule = { filters: { legislature: leg } };

            const [composantes, assemblee, groupesComposantes, groupesTaux, identite] = await Promise.all([
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-composantes", statDepute(uid, leg))),
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
                "kpi-presence-scrutins": { data: { label: "participation aux scrutins (votes personnels)", value: pct(valeurs.get("Participation aux scrutins")) } },
                "chart-presence-comparaison": comparaison([
                    { nom: "Ce député", valeurs },
                    { nom: groupeCode ? `Groupe ${groupeCode}` : "Son groupe", valeurs: valeursGroupe(groupesComposantes, groupesTaux, groupeCode) },
                    { nom: "Assemblée", valeurs: valeursComposantes(assemblee) },
                ]),
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
        ],
    },
    {
        id: "presence-mois",
        label: "Mois par mois",
        icon: TrendingUp,
        description: "Taux de présence et jours de présence, mois après mois, sur cette législature",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const [evolution, jours] = await Promise.all([
                lireStat(statisticsGateway.fetchStat("acteurs", "presence", statDepute(uid, legislature))),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-jours-mensuels", statDepute(uid, legislature))),
            ]);
            return {
                "chart-presence-evolution": { data: pointsOf(evolution) },
                "chart-presence-jours-mensuels": { data: pointsOf(jours) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart", colSpan: 2, config: chart("chart-presence-evolution"), formulas: [F_DEPUTE_TAUX_MOIS] },
            { type: "chart", colSpan: 2, config: chart("chart-presence-jours-mensuels"), formulas: [F_DEPUTE_JOURS_MOIS] },
        ],
    },
    {
        id: "presence-sources",
        label: "Sources et années de mandat",
        icon: CalendarRange,
        description: "Ce qui atteste sa présence (vote, prise de parole, commission) et son rythme d'une année de mandat à l'autre",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const [sources, mandat] = await Promise.all([
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-sources", statDepute(uid, legislature))),
                lireStat(statisticsGateway.fetchStat("acteurs", "presence-annee-mandat", statDepute(uid, legislature))),
            ]);
            return {
                "chart-presence-sources": {
                    data: (seriesOf(sources)[0]?.items ?? []).map((i) => ({ label: sansPrefixe(i.label), value: i.value })),
                },
                "chart-presence-annee-mandat": { data: pointsOf(mandat).map((p) => ({ label: sansPrefixe(p.label), value: p.value })) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart", colSpan: 2, config: chart("chart-presence-sources"), formulas: [F_DEPUTE_SOURCES] },
            { type: "chart", colSpan: 2, config: chart("chart-presence-annee-mandat"), formulas: [F_DEPUTE_ANNEE_MANDAT] },
        ],
    },
];

// ── Votes et activité législative ───────────────────────────────────────────

const VOTES: PageSection[] = [
    {
        id: "votes-comportement",
        label: "Comportement au vote",
        icon: Vote,
        description: "Participation, fidélité au groupe et votes rebelles sur cette législature",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const stats = await deputesGateway.getDeputeVoteStats(uid as string, legislature as number);

            return {
                "kpi-vote-participation": {
                    data: {
                        label: "participation aux votes (délégations comprises)",
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
                // Ses votes exprimés, rapportés aux scrutins où il pouvait voter (dénominateur du taux).
                "kpi-vote-total": {
                    data: {
                        label: `votes exprimés, sur ${stats.scrutinsVotables} scrutins où il pouvait voter`,
                        value: stats.votesExprimes,
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
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-vote-total") },
            { type: "card", colSpan: 1, config: card("kpi-vote-participation") },
            { type: "card", colSpan: 1, config: card("kpi-vote-fidelite") },
            { type: "card", colSpan: 1, config: card("kpi-vote-rebel") },
            // Rangée de 4 KPI : un seul accordéon sur toute la largeur.
            { type: "formulas", colSpan: 4, formulas: [F_DEPUTE_PARTICIPATION_VOTES] },
            { type: "card", colSpan: 2, config: card("kpi-vote-breakdown") },
            { type: "chart", colSpan: 2, config: chart("chart-vote-positions") },
        ],
    },
    {
        id: "votes-recents",
        label: "Votes récents",
        icon: ListChecks,
        description: "Ses derniers votes sur cette législature",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const recentVotes = await deputesGateway.getDeputeRecentVotes(uid as string, legislature as number);
            return { "depute-recent-votes-table": recentVotes } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("depute-recent-votes-table"),
            } satisfies SectionBlock<DeputeRecentVoteDTO>,
        ],
    },
    {
        id: "amendements",
        label: "Amendements",
        icon: FileText,
        description: "Amendements déposés et adoptés sur cette législature",
        cols: 3,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const amendementStats = await deputesGateway.getDeputeAmendementStats(uid as string, legislature as number);
            return {
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
            { type: "card", colSpan: 1, config: card("kpi-amendements-deposes") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-adoptes") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-taux") },
        ],
    },
];

// ── Mandats ─────────────────────────────────────────────────────────────────

const MANDATS: PageSection[] = [
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
];

// ── Dossiers législatifs ────────────────────────────────────────────────────

const DOSSIERS: PageSection[] = [
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

/**
 * Fiche député : un onglet par thème, chacun découpé en sections (ses
 * sous-thèmes, listés dans la nav latérale de l'onglet dès qu'il y en a deux).
 */
export const DEPUTE_ONGLETS: TabDefinition<PageSection>[] = [
    { id: "activite", label: "Activité", icon: CalendarDays, sections: ACTIVITE },
    { id: "presence", label: "Présence", icon: Gauge, sections: PRESENCE },
    { id: "votes", label: "Votes et amendements", icon: Vote, sections: VOTES },
    { id: "historique", label: "Mandats", icon: History, sections: MANDATS },
    { id: "dossiers", label: "Dossiers législatifs", icon: Landmark, sections: DOSSIERS },
];

/** Toutes les sections, à plat (chargement de la fiche : on attend chacune). */
export const DEPUTE_SECTIONS: PageSection[] = DEPUTE_ONGLETS.flatMap((onglet) => onglet.sections);

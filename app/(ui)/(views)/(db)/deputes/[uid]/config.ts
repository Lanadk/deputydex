import { BookOpen, FileText, User, Vote } from "lucide-react";
import { card, chart, table } from "@/app/(ui)/(views)/(db)/deputes/[uid]/registry";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";

export const DEPUTE_SECTIONS: PageSection[] = [
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

    // ── Votes & comportement ─────────────────────────────────────────────────
    {
        id: "votes",
        label: "Comportement au vote",
        icon: Vote,
        description: "Participation, fidélité au groupe et votes rebelles sur cette législature",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const [stats, recentVotes] = await Promise.all([
                deputesGateway.getDeputeVoteStats(uid as string, legislature as number),
                deputesGateway.getDeputeRecentVotes(uid as string, legislature as number),
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
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-vote-participation") },
            { type: "card", colSpan: 1, config: card("kpi-vote-fidelite") },
            { type: "card", colSpan: 1, config: card("kpi-vote-rebel") },
            { type: "card", colSpan: 1, config: card("kpi-vote-total") },
            { type: "card", colSpan: 2, config: card("kpi-vote-breakdown") },
            { type: "chart", colSpan: 2, config: chart("chart-vote-positions") },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("depute-recent-votes-table"),
            } satisfies SectionBlock<DeputeRecentVoteDTO>,
        ],
    },

    // ── Activité législative ─────────────────────────────────────────────────
    {
        id: "activite",
        label: "Activité législative",
        icon: FileText,
        description: "Amendements déposés et adoptés sur cette législature",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const stats = await deputesGateway.getDeputeAmendementStats(uid as string, legislature as number);
            return {
                "kpi-amendements-deposes": {
                    data: { label: "amendements déposés", value: stats.totalDepose },
                },
                "kpi-amendements-adoptes": {
                    data: { label: "amendements adoptés", value: stats.totalAdopte },
                },
                "kpi-amendements-taux": {
                    data: { label: "taux d'adoption", value: `${stats.tauxAdoption}%` },
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-amendements-deposes") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-adoptes") },
            { type: "card", colSpan: 1, config: card("kpi-amendements-taux") },
        ],
    },

    // ── Profil socio-professionnel ────────────────────────────────────────────
    {
        id: "profil",
        label: "Profil socio-professionnel",
        icon: User,
        description: "Profession et catégorie socio-professionnelle avant le mandat",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, legislature }: Record<string, unknown>) => {
            const identity = await deputesGateway.getDeputeIdentity(uid as string, legislature as number);
            return {
                "kpi-profession": {
                    data: { label: "profession", value: identity.professionLibelle ?? "Non renseigné" },
                },
                "kpi-categorie": {
                    data: { label: "catégorie", value: identity.professionCategorie ?? "Non renseigné" },
                },
                "kpi-famille": {
                    data: { label: "famille CSP", value: identity.professionFamille ?? "Non renseigné" },
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 2, config: card("kpi-profession") },
            { type: "card", colSpan: 1, config: card("kpi-categorie") },
            { type: "card", colSpan: 1, config: card("kpi-famille") },
        ],
    },
];

import { Armchair, ChartPie, Users, Vote } from "lucide-react";
import { card, chart, table } from "@/app/(ui)/(views)/(db)/scrutins/[uid]/registry";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { ScrutinGroupeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-groupe-vote.dto";
import { ScrutinDeputeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-depute-vote.dto";
import { ScrutinSiegePosition } from "@/app/domains/scrutins/dto/scrutin-hemicycle.dto";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { HemicycleDataWrapper } from "@/app/(ui)/component-library/template/sections/block-section/hemicycle-config.types";
import { votePositionColor } from "@/app/(ui)/_shared/adapter/vote-position.adapter";

const kpi = (label: string, value: number | null) => ({ data: { label, value: value ?? "—" } });

/** Ordre de la légende de l'hémicycle (non-votant affiché seulement s'il y en a). */
const HEMICYCLE_LEGENDE: { key: ScrutinSiegePosition; label: string }[] = [
    { key: "pour", label: "Pour" },
    { key: "contre", label: "Contre" },
    { key: "abstention", label: "Abstention" },
    { key: "non_votant", label: "Non-votant" },
    { key: "absent", label: "Absent" },
];

export const SCRUTIN_SECTIONS: PageSection[] = [
    // ── Hémicycle ───────────────────────────────────────────────────────────
    {
        id: "hemicycle",
        label: "Hémicycle",
        icon: Armchair,
        description: "Chaque député en mandat ce jour-là, à son siège dans l'hémicycle, coloré selon son vote. Survolez un siège pour voir le député, cliquez une couleur de la légende pour la mettre en avant.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid }: Record<string, unknown>) => {
            const { sieges, groupes, totaux } = await scrutinsGateway.getScrutinHemicycle(uid as string);
            const data: HemicycleDataWrapper = {
                seats: sieges.map((s) => ({
                    id: s.deputeUid,
                    key: s.position,
                    color: votePositionColor(s.position) ?? "#d1d5db",
                    label: s.nomComplet,
                    sublabel: [s.groupeCode ? groupes[s.groupeCode] ?? s.groupeCode : null, s.positionLabel].filter(Boolean).join(" · "),
                    href: `/deputes/${s.deputeUid}`,
                })),
                legend: HEMICYCLE_LEGENDE
                    .filter(({ key }) => key !== "non_votant" || totaux.non_votant > 0)
                    .map(({ key, label }) => ({ key, label, color: votePositionColor(key) ?? "#d1d5db", count: totaux[key] })),
                ariaLabel: `Hémicycle du scrutin : ${totaux.pour} pour, ${totaux.contre} contre, ${totaux.abstention} abstentions, ${totaux.absent} absents`,
            };
            return { "scrutin-hemicycle": data } as Record<string, BlockDataWrapper>;
        },
        blocks: [{ type: "hemicycle", colSpan: 4, config: { id: "scrutin-hemicycle" } }],
    },

    // ── Résultat ────────────────────────────────────────────────────────────
    {
        id: "resultat",
        label: "Résultat",
        icon: ChartPie,
        description: "Totaux du scrutin : votants, suffrages exprimés, majorité requise et répartition des voix",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid, scrutin }: Record<string, unknown>) => {
            // Scrutin déjà lu par la page serveur (voir page.tsx) ; sinon on le charge.
            const { totaux } = (scrutin as ScrutinDetailDTO | null) ?? await scrutinsGateway.getScrutin(uid as string);
            const pour = totaux.pour ?? 0;
            const contre = totaux.contre ?? 0;
            const abstentions = totaux.abstentions ?? 0;
            return {
                "kpi-scrutin-votants": kpi("votants", totaux.votants),
                "kpi-scrutin-exprimes": kpi("suffrages exprimés", totaux.exprimes),
                "kpi-scrutin-requis": kpi("majorité requise", totaux.requis),
                "kpi-scrutin-non-votants": kpi("non-votants", totaux.nonVotants),
                "kpi-scrutin-breakdown": {
                    data: {
                        title: "Voix",
                        maxValue: totaux.votants ?? pour + contre + abstentions,
                        items: [
                            { label: "Pour", value: pour, color: votePositionColor("pour") },
                            { label: "Contre", value: contre, color: votePositionColor("contre") },
                            { label: "Abstention", value: abstentions, color: votePositionColor("abstention") },
                        ],
                    },
                },
                "chart-scrutin-positions": {
                    type: "donut",
                    data: [
                        { label: "Pour", value: pour },
                        { label: "Contre", value: contre },
                        { label: "Abstention", value: abstentions },
                    ],
                },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card", colSpan: 1, config: card("kpi-scrutin-votants") },
            { type: "card", colSpan: 1, config: card("kpi-scrutin-exprimes") },
            { type: "card", colSpan: 1, config: card("kpi-scrutin-requis") },
            { type: "card", colSpan: 1, config: card("kpi-scrutin-non-votants") },
            { type: "card", colSpan: 2, config: card("kpi-scrutin-breakdown") },
            { type: "chart", colSpan: 2, config: chart("chart-scrutin-positions") },
        ],
    },

    // ── Votes par groupe ──────────────────────────────────────────────────
    {
        id: "groupes",
        label: "Votes par groupe",
        icon: Users,
        description: "Pour chaque groupe : décompte des votes de ses membres et position majoritaire",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid }: Record<string, unknown>) => {
            const groupes = await scrutinsGateway.getScrutinGroupes(uid as string);
            return { "scrutin-groupes-table": groupes } as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("scrutin-groupes-table"),
            } satisfies SectionBlock<ScrutinGroupeVoteDTO>,
        ],
    },

    // ── Votes des députés ──────────────────────────────────────────────────
    {
        id: "deputes",
        label: "Votes des députés",
        icon: Vote,
        description: "Vote de chaque député, filtrable par groupe et par position ; les votes rebelles sont signalés",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ uid }: Record<string, unknown>) => {
            const votes = await scrutinsGateway.getScrutinVotes(uid as string);
            return { "scrutin-votes-table": votes } as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "table" as const,
                colSpan: 4,
                ...table("scrutin-votes-table"),
            } satisfies SectionBlock<ScrutinDeputeVoteDTO>,
        ],
    },
];

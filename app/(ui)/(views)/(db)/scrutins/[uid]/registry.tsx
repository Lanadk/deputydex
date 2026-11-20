import React from "react";
import Link from "next/link";
import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";
import { CardConfig } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import { GroupCell } from "@/app/(ui)/components/groups/group-cell";
import { votePositionColor } from "@/app/(ui)/_shared/adapter/vote-position.adapter";
import { ScrutinGroupeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-groupe-vote.dto";
import { ScrutinDeputeVoteDTO } from "@/app/domains/scrutins/dto/scrutin-depute-vote.dto";

function PositionCell({ position, label }: { position: string | null; label: string | null }) {
    if (!position || !label) return <>—</>;
    return <span style={{ color: votePositionColor(position), fontWeight: 600 }}>{label}</span>;
}

/** Options du filtre "Groupe", calculées depuis les votes chargés (groupes présents sur CE scrutin). */
function groupeOptions(rows: ScrutinDeputeVoteDTO[]): { value: string; label: string }[] {
    const labels = new Set(rows.map((r) => r.groupeLabel).filter((l): l is string => !!l));
    return [...labels].sort((a, b) => a.localeCompare(b, "fr")).map((l) => ({ value: l, label: l }));
}

// ── Cards ────────────────────────────────────────────────────────────────────

const SCRUTIN_CARD_REGISTRY: CardConfig[] = [
    { id: "kpi-scrutin-votants", displayType: "kpi-card" },
    { id: "kpi-scrutin-exprimes", displayType: "kpi-card" },
    { id: "kpi-scrutin-requis", displayType: "kpi-card" },
    { id: "kpi-scrutin-non-votants", displayType: "kpi-card" },
    { id: "kpi-scrutin-breakdown", displayType: "kpi-bar-card" },
];

// ── Charts ───────────────────────────────────────────────────────────────────

const SCRUTIN_CHART_REGISTRY: ChartConfig[] = [
    {
        id: "chart-scrutin-positions",
        title: "Répartition des voix",
        subtitle: "Pour / Contre / Abstention",
        theme: "vote-positions",
        displayType: "donut",
    },
];

// ── Tables ───────────────────────────────────────────────────────────────────

const SCRUTIN_TABLE_REGISTRY: (TableConfig<ScrutinGroupeVoteDTO> | TableConfig<ScrutinDeputeVoteDTO>)[] = [
    {
        id: "scrutin-groupes-table",
        title: "Votes par groupe",
        subtitle: "Décompte de chaque groupe et sa position majoritaire",
        columns: [
            { id: "groupe", header: "Groupe", align: "left", cell: (r) => <GroupCell code={r.groupeCode} label={r.groupeLabel} /> },
            { id: "membres", header: "Membres", align: "center", cell: (r) => r.nombreMembres ?? "—" },
            { id: "pour", header: "Pour", align: "center", cell: (r) => r.pour },
            { id: "contre", header: "Contre", align: "center", cell: (r) => r.contre },
            { id: "abstentions", header: "Abstention", align: "center", cell: (r) => r.abstentions },
            { id: "non-votants", header: "Non-votants", align: "center", cell: (r) => r.nonVotants },
            {
                id: "position",
                header: "Position majoritaire",
                align: "center",
                cell: (r) => <PositionCell position={r.positionMajoritaire} label={r.positionMajoritaireLabel} />,
            },
        ],
        getRowKey: (r) => r.groupeCode,
        striped: true,
    } satisfies TableConfig<ScrutinGroupeVoteDTO>,
    {
        id: "scrutin-votes-table",
        title: "Votes des députés",
        subtitle: "❗ : vote différent de la position majoritaire du groupe",
        columns: [
            {
                id: "rebelle",
                header: "",
                align: "center",
                width: 32,
                cell: (r) => r.isRebelle ? (
                    <span title={`Vote rebelle : le groupe a voté ${r.groupePositionLabel?.toLowerCase()}`} style={{ cursor: "help" }}>
                        ❗
                    </span>
                ) : null,
            },
            {
                id: "depute",
                header: "Député",
                align: "left",
                cell: (r) => <Link href={`/deputes/${r.deputeUid}`} className="hover:underline">{r.nomComplet}</Link>,
            },
            {
                id: "groupe",
                header: "Groupe",
                align: "left",
                cell: (r) => r.groupeCode && r.groupeLabel ? <GroupCell code={r.groupeCode} label={r.groupeLabel} /> : "—",
            },
            {
                id: "position",
                header: "Vote",
                align: "center",
                cell: (r) => <PositionCell position={r.position} label={r.positionLabel} />,
            },
            {
                id: "groupe-position",
                header: "Position du groupe",
                align: "center",
                cell: (r) => <PositionCell position={r.groupePosition} label={r.groupePositionLabel} />,
            },
            {
                id: "delegation",
                header: "Délégation",
                align: "center",
                cell: (r) => r.parDelegation ? "Oui" : "",
            },
        ],
        getRowKey: (r) => r.deputeUid,
        striped: true,
        pagination: { pageSize: 20 },
        filter: {
            sortOptions: [
                { id: "nom", label: "Nom", field: "nom", direction: "asc" },
                { id: "groupe", label: "Groupe", field: "groupeLabel", direction: "asc" },
                { id: "vote", label: "Vote", field: "positionLabel", direction: "asc" },
            ],
            filterFields: [
                { field: "nomComplet", label: "Député", type: "string" },
                { field: "groupeLabel", label: "Groupe", type: "select" },
                {
                    field: "positionLabel",
                    label: "Vote",
                    type: "select",
                    selectOptions: ["Pour", "Contre", "Abstention", "Non-votant"].map((l) => ({ value: l, label: l })),
                },
                {
                    field: "isRebelle",
                    label: "Vote rebelle",
                    type: "select",
                    selectOptions: [
                        { value: "true", label: "Oui" },
                        { value: "false", label: "Non" },
                    ],
                },
            ],
            selectOptionsFromRows: { groupeLabel: groupeOptions },
            applyMode: "auto",
        },
    } satisfies TableConfig<ScrutinDeputeVoteDTO>,
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export const card = makeRegistryHelper(SCRUTIN_CARD_REGISTRY, "CardConfig");
export const chart = makeRegistryHelper(SCRUTIN_CHART_REGISTRY, "ChartConfig");
export const table = makeRegistryHelper(SCRUTIN_TABLE_REGISTRY as TableConfig[], "TableConfig");

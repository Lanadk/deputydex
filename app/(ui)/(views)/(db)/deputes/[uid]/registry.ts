import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";
import { CardConfig } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";

// ── Tables ──────────────────────────────────────────────────────────────────

const DEPUTE_TABLE_REGISTRY: (TableConfig<DeputeMandatDTO> | TableConfig<DeputeRecentVoteDTO>)[] = [
    {
        id: "depute-mandats-table",
        title: "Historique des mandats",
        subtitle: "Tous les mandats exercés par ce député",
        columns: [
            {
                id: "type",
                header: "Type",
                align: "center",
                cell: (r: DeputeMandatDTO) => r.typeOrgane,
            },
            {
                id: "qualite",
                header: "Qualité",
                align: "center",
                cell: (r: DeputeMandatDTO) => r.libQualite,
            },
            {
                id: "debut",
                header: "Début",
                align: "center",
                cell: (r: DeputeMandatDTO) => new Date(r.dateDebut).toLocaleDateString("fr-FR"),
            },
            {
                id: "fin",
                header: "Fin",
                align: "center",
                cell: (r: DeputeMandatDTO) => r.dateFin ? new Date(r.dateFin).toLocaleDateString("fr-FR") : "En cours",
            },
            {
                id: "duree",
                header: "Durée",
                align: "center",
                cell: (r: DeputeMandatDTO) => r.dureeAns !== null ? `${r.dureeAns} an(s)` : "—",
            },
        ],
        getRowKey: (r: DeputeMandatDTO) => r.uid,
        pagination: { pageSize: 10 },
    } as TableConfig<DeputeMandatDTO>,
    {
        id: "depute-recent-votes-table",
        title: "Derniers votes",
        subtitle: "Les 20 derniers scrutins auxquels ce député a participé",
        columns: [
            {
                id: "titre",
                header: "Scrutin",
                align: "left",
                cell: (r: DeputeRecentVoteDTO) => r.titre ?? "—",
            },
            {
                id: "date",
                header: "Date",
                align: "center",
                cell: (r: DeputeRecentVoteDTO) => r.date ? new Date(r.date).toLocaleDateString("fr-FR") : "—",
            },
            {
                id: "position",
                header: "Position",
                align: "center",
                cell: (r: DeputeRecentVoteDTO) => r.position,
            },
            {
                id: "groupe",
                header: "Groupe",
                align: "center",
                cell: (r: DeputeRecentVoteDTO) => r.groupePosition ?? "—",
            },
            {
                id: "rebelle",
                header: "Rebelle",
                align: "center",
                cell: (r: DeputeRecentVoteDTO) => r.isRebel ? "⚡ Oui" : "—",
            },
        ],
        getRowKey: (r: DeputeRecentVoteDTO) => r.scrutinUid,
        pagination: { pageSize: 10 },
    } as TableConfig<DeputeRecentVoteDTO>,
];

// ── Cards ────────────────────────────────────────────────────────────────────

const DEPUTE_CARD_REGISTRY: CardConfig[] = [
    { id: "kpi-vote-participation", displayType: "kpi-card" },
    { id: "kpi-vote-fidelite", displayType: "kpi-card" },
    { id: "kpi-vote-rebel", displayType: "kpi-card" },
    { id: "kpi-vote-total", displayType: "kpi-card" },
    { id: "kpi-amendements-deposes", displayType: "kpi-card" },
    { id: "kpi-amendements-adoptes", displayType: "kpi-card" },
    { id: "kpi-amendements-taux", displayType: "kpi-card" },
    { id: "kpi-profession", displayType: "kpi-card" },
    { id: "kpi-categorie", displayType: "kpi-card" },
    { id: "kpi-famille", displayType: "kpi-card" },
    {
        id: "kpi-vote-breakdown",
        displayType: "kpi-bar-card",
    },
];

// ── Charts ───────────────────────────────────────────────────────────────────

const DEPUTE_CHART_REGISTRY: ChartConfig[] = [
    {
        id: "chart-vote-positions",
        title: "Répartition des votes",
        subtitle: "Pour / Contre / Abstention / Non-votant",
        theme: "vote-positions",
        displayType: "donut",
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export const card = makeRegistryHelper(DEPUTE_CARD_REGISTRY, "CardConfig");
export const table = makeRegistryHelper(DEPUTE_TABLE_REGISTRY as TableConfig[], "TableConfig");
export const chart = makeRegistryHelper(DEPUTE_CHART_REGISTRY, "ChartConfig");

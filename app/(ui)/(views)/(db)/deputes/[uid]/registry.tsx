import React from "react";
import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";
import { CardConfig } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { ActivityCalendarConfig } from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { DossierListConfig } from "@/app/(ui)/component-library/template/sections/block-section/dossier-list-config.types";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";

const VOTE_POSITION_COLORS: Record<string, string> = {
    pour: "#22c55e",
    contre: "#ef4444",
    abstention: "#f59e0b",
    nonvotant: "#94a3b8",
};

function votePositionColor(position: string | null): string | undefined {
    if (!position) return undefined;
    return VOTE_POSITION_COLORS[position.toLowerCase()];
}

const TYPE_ORGANE_LABELS: Record<string, string> = {
    ASSEMBLEE: "Assemblée nationale",
    API: "Assemblée parlementaire internationale",
    BUREAU: "Bureau de l'Assemblée nationale",
    CJR: "Cour de justice de la République",
    CMP: "Commission mixte paritaire",
    CNPE: "Commission d'enquête",
    CNPS: "Commission spéciale",
    COMNL: "Commission spéciale",
    COMPER: "Commission permanente",
    COMSENAT: "Commission (Sénat)",
    COMSPSENAT: "Commission spéciale (Sénat)",
    CONFPT: "Conférence des présidents",
    DELEG: "Délégation",
    DELEGBUREAU: "Délégation du Bureau",
    DELEGSENAT: "Délégation (Sénat)",
    GA: "Groupe d'amitié",
    GE: "Groupe d'études",
    GEVI: "Groupe d'études à vocation internationale",
    GOUVERNEMENT: "Gouvernement",
    GP: "Groupe politique",
    GROUPESENAT: "Groupe (Sénat)",
    MINISTERE: "Ministère",
    MISINFO: "Mission d'information",
    MISINFOCOM: "Mission d'information commune",
    MISINFOPRE: "Mission d'information de la Conférence des présidents",
    OFFPAR: "Office parlementaire",
    ORGEXTPARL: "Organisme extra-parlementaire",
    PARPOL: "Parti politique",
    PRESREP: "Présidence de la République",
    SENAT: "Sénat",
};

function typeOrganeLabel(typeOrgane: string): string {
    return TYPE_ORGANE_LABELS[typeOrgane] ?? typeOrgane;
}

function formatDuree(dateDebutISO: string, dateFinISO: string | null): string {
    const start = new Date(dateDebutISO);
    const end = dateFinISO ? new Date(dateFinISO) : new Date();

    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (end.getDate() < start.getDate()) months -= 1;
    months = Math.max(0, months);

    if (months < 1) {
        const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        return `${days} jour(s)`;
    }
    if (months < 12) {
        return `${months} mois`;
    }
    return `${Math.floor(months / 12)} an(s)`;
}

// ── Calendrier d'activité ────────────────────────────────────────────────────

const DEPUTE_ACTIVITY_CALENDAR_REGISTRY: ActivityCalendarConfig[] = [
    { id: "depute-activity-calendar", displayType: "tooltip-and-href" },
];

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
                cell: (r: DeputeMandatDTO) => typeOrganeLabel(r.typeOrgane),
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
                cell: (r: DeputeMandatDTO) => formatDuree(r.dateDebut, r.dateFin),
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
                id: "rebelle",
                header: "",
                align: "center",
                width: 32,
                cell: (r: DeputeRecentVoteDTO) => r.isRebel ? (
                    <span title="Vote rebelle : différent du groupe" style={{ cursor: "help" }}>
                        ❗
                    </span>
                ) : null,
            },
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
                cell: (r: DeputeRecentVoteDTO) => (
                    <span style={{ color: votePositionColor(r.position), fontWeight: 600 }}>
                        {r.position}
                    </span>
                ),
            },
            {
                id: "groupe",
                header: "Groupe",
                align: "center",
                cell: (r: DeputeRecentVoteDTO) => r.groupePosition ? (
                    <span style={{ color: votePositionColor(r.groupePosition), fontWeight: 600 }}>
                        {r.groupePosition}
                    </span>
                ) : "—",
            },
        ],
        getRowKey: (r: DeputeRecentVoteDTO) => r.scrutinUid,
        pagination: { pageSize: 10 },
    } as TableConfig<DeputeRecentVoteDTO>,
];

// ── Dossiers législatifs ─────────────────────────────────────────────────────

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Dates "jour seul" de l'open data (minuit UTC) : formatées en UTC pour ne pas glisser d'un jour. */
function formatDateOnly(iso: string | null): string | null {
    return iso ? new Date(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" }) : null;
}

function hasStrongRole(r: DeputeDossierContributionDTO): boolean {
    return r.isInitiateur || r.rolesRapporteur.length > 0;
}

const DEPUTE_DOSSIER_LIST_REGISTRY: DossierListConfig<DeputeDossierContributionDTO>[] = [
    {
        id: "depute-dossiers-list",
        title: "Dossiers législatifs",
        subtitle: "Textes sur lesquels ce député a déposé ou co-signé des amendements, été rapporteur ou auteur",
        pageSize: 10,
        searchPlaceholder: "Rechercher un dossier",
        emptyLabel: "Aucune contribution à un dossier législatif sur cette législature.",
        getSearchText: (r) => r.titre,
        getRowKey: (r) => r.dossierUid,
        sortOptions: [
            // L'API renvoie déjà les dossiers par implication (rôles, puis volume) : tri stable = ordre serveur.
            { value: "implication", label: "Implication", compare: () => 0 },
            { value: "deposes", label: "Amendements déposés", compare: (a, b) => b.nbDeposes - a.nbDeposes },
            { value: "adoptes", label: "Amendements adoptés", compare: (a, b) => b.nbAdoptes - a.nbAdoptes },
            {
                value: "recent",
                label: "Activité récente",
                compare: (a, b) => (b.derniereActivite ?? "").localeCompare(a.derniereActivite ?? ""),
            },
        ],
        toggles: [
            {
                id: "sans-cosignature-seule",
                label: "Masquer les co-signatures seules",
                keep: (r) => r.nbDeposes > 0 || hasStrongRole(r),
            },
        ],
        toCard: (r) => ({
            title: r.titre,
            href: r.lienAN,
            subtitle: r.procedure,
            badges: [
                ...(r.isInitiateur ? ["Auteur du texte"] : []),
                ...r.rolesRapporteur.map(capitalize),
            ],
            stats: [
                { label: "déposés", value: r.nbDeposes },
                { label: "adoptés", value: r.nbAdoptes },
                { label: "co-signés", value: r.nbCosignes },
            ],
            itemsLabel: "Amendements déposés",
            emptyLabel: "Aucun amendement déposé par ce député sur ce dossier.",
        }),
        loadItems: async (r, params) => {
            const amendements = await deputesGateway.getDeputeDossierAmendements(
                params.uid as string,
                params.legislature as number,
                r.dossierUid
            );
            return amendements.map((a) => ({
                id: a.uid,
                label: a.numero ? `n° ${a.numero}` : "Amendement",
                context: a.division,
                status: a.statut,
                tone: a.isAdopte ? "success" as const : "neutral" as const,
                date: formatDateOnly(a.dateDepot),
                summary: a.exposeSommaire,
                href: a.lienAN,
            }));
        },
    },
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
export const dossierList = makeRegistryHelper(DEPUTE_DOSSIER_LIST_REGISTRY, "DossierListConfig");
export const activityCalendar = makeRegistryHelper(DEPUTE_ACTIVITY_CALENDAR_REGISTRY, "ActivityCalendarConfig");

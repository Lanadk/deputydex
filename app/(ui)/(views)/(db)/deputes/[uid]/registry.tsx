import React from "react";
import Link from "next/link";
import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";
import { CardConfig } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { ActivityCalendarConfig } from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { DeputeRecentVoteDTO } from "@/app/domains/deputes/dto/depute-recent-vote.dto";
import { ExpandableCardListConfig } from "@/app/(ui)/component-library/template/sections/block-section/expandable-card-list-config.types";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { capitalizeFirst } from "@/app/_shared/utils/string";
import { votePositionColor } from "@/app/(ui)/_shared/adapter/vote-position.adapter";

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
    { id: "depute-activity-calendar", displayType: "tooltip-and-href", title: "Calendrier d'activité" },
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
                // Fiche DeputeDex en lien principal, page de l'AN en lien secondaire (issue #170).
                cell: (r: DeputeRecentVoteDTO) => (
                    <span>
                        <Link href={`/scrutins/${r.scrutinUid}`} className="summary-list-card__link">
                            {r.titre ?? `Scrutin ${r.scrutinUid}`}
                        </Link>
                        {r.lienAN && (
                            <a
                                href={r.lienAN}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-xs text-gray-500 hover:underline"
                                aria-label="Voir le scrutin sur le site de l'Assemblée nationale"
                                title="Voir sur le site de l'Assemblée nationale"
                            >
                                ↗
                            </a>
                        )}
                    </span>
                ),
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

/** Contribution forte (voir GLOSSARY.md) : auteur du texte ou rapporteur — tout sauf de la co-signature. */
function hasStrongRole(r: DeputeDossierContributionDTO): boolean {
    return r.isAuteurTexte || r.rapporteurs.length > 0;
}

function roleBadges(r: DeputeDossierContributionDTO): string[] {
    const texte = r.isAuteurTexte ? ["Auteur du texte"] : r.isCosignataireTexte ? ["Co-signataire du texte"] : [];
    const rapporteurs = r.rapporteurs.map((rap) => `${capitalizeFirst(rap.type ?? "rapporteur")} · ${rap.etape}`);
    return [...texte, ...rapporteurs];
}

/** Affichage seulement : le chargement du détail (`loadItems`) est branché dans config.ts. */
const DEPUTE_DOSSIER_LIST_REGISTRY: Omit<ExpandableCardListConfig<DeputeDossierContributionDTO>, "loadItems">[] = [
    {
        id: "depute-dossiers-list",
        title: "Dossiers législatifs",
        subtitle: "Textes sur lesquels ce député a déposé ou co-signé des amendements, été rapporteur, auteur ou co-signataire",
        pageSize: 5,
        searchPlaceholder: "Rechercher un dossier",
        emptyLabel: "Aucune contribution à un dossier législatif sur cette législature.",
        noMatchLabel: "Aucun dossier ne correspond à ces critères.",
        countLabel: (n) => `${n} dossier(s)`,
        getSearchText: (r) => r.titre,
        getRowKey: (r) => r.dossierUid,
        sortOptions: [
            // Ordre serveur (repository : auteur/rapporteur, puis déposés, puis co-signatures) ; tri stable.
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
                // Co-signer un amendement ou le texte : contribution faible, masquée par défaut.
                keep: (r) => r.nbDeposes > 0 || hasStrongRole(r),
                defaultChecked: true,
            },
        ],
        toCard: (r) => ({
            title: r.titre,
            href: r.lienAN,
            subtitle: r.procedure,
            badges: roleBadges(r),
            stats: [
                { label: "déposés", value: r.nbDeposes },
                { label: "adoptés", value: r.nbAdoptes },
                { label: "co-signés", value: r.nbCosignes },
            ],
            itemsLabel: "Amendements déposés",
            emptyLabel: "Aucun amendement déposé par ce député sur ce dossier.",
        }),
    },
];

// ── Cards ────────────────────────────────────────────────────────────────────

const DEPUTE_CARD_REGISTRY: CardConfig[] = [
    { id: "card-score-depute", displayType: "score-card" },
    { id: "card-score-detail", displayType: "score-breakdown-card" },
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
    { id: "kpi-presence-taux", displayType: "kpi-card" },
    { id: "kpi-presence-seance", displayType: "kpi-card" },
    { id: "kpi-presence-commission", displayType: "kpi-card" },
    { id: "kpi-presence-scrutins", displayType: "kpi-card" },
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
    {
        id: "chart-presence-comparaison",
        title: "Comparé à son groupe et à l'Assemblée (en %)",
        subtitle: "Taux de présence et ses composantes, sur la législature affichée",
        theme: "presence",
        displayType: "bar-multi",
    },
    {
        id: "chart-presence-evolution",
        title: "Taux de présence, mois par mois (en %)",
        theme: "presence",
        displayType: "line",
    },
    {
        id: "chart-presence-jours-mensuels",
        title: "Jours de présence par mois",
        subtitle: "Toutes sources : vote, prise de parole, commission",
        theme: "presence",
        displayType: "bar",
    },
    {
        id: "chart-presence-sources",
        title: "Jours de présence par source",
        subtitle: "Un même jour peut cumuler plusieurs sources",
        theme: "presence",
        displayType: "bar",
    },
    {
        id: "chart-presence-annee-mandat",
        title: "Jours de présence par mois, par année de mandat",
        subtitle: "Depuis sa prise de fonction dans la législature",
        theme: "presence",
        displayType: "bar",
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export const card = makeRegistryHelper(DEPUTE_CARD_REGISTRY, "CardConfig");
export const table = makeRegistryHelper(DEPUTE_TABLE_REGISTRY as TableConfig[], "TableConfig");
export const chart = makeRegistryHelper(DEPUTE_CHART_REGISTRY, "ChartConfig");
export const dossierList = makeRegistryHelper(DEPUTE_DOSSIER_LIST_REGISTRY, "ExpandableCardListConfig");
export const activityCalendar = makeRegistryHelper(DEPUTE_ACTIVITY_CALENDAR_REGISTRY, "ActivityCalendarConfig");

import Link from "next/link";
import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";
import { CardConfig } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import { GroupeFeminisationRowDTO } from "@/app/domains/groupes/dto/groupes-feminisation.dto";
import { GroupeAgeRowDTO } from "@/app/domains/groupes/dto/groupes-age.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { getCanonicalGroupTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

/**
 * Registre commun card/chart/table pour TOUTES les pages "Chiffres clés"
 * (`chiffres-cles/themes/<slug>.sections.ts`) — même principe que
 * `groupes/[code]/registry.ts`, mais partagé entre tous les thèmes plutôt que
 * propre à une seule page : les ids de blocks n'ont besoin d'être uniques que
 * dans ce fichier, pas globalement. Un thème qui grossit beaucoup peut migrer
 * vers son propre fichier `themes/<slug>.registry.ts` le jour où ça devient
 * illisible ici — pas la peine avant.
 */

/** Ligne de la table "féminisation des groupes" : le DTO + le rang (déjà calculé côté gatewayFn, le DTO arrive trié) */
export type GroupeFeminisationTableRow = GroupeFeminisationRowDTO & { rank: number };

/** Même principe pour la table "âge des groupes". */
export type GroupeAgeTableRow = GroupeAgeRowDTO & { rank: number };

/** Table "effectifs des groupes" : `GroupeCardDTO` porte déjà tout (code, libellé, effectif) — pas de DTO dédié nécessaire. */
export type GroupeEffectifTableRow = GroupeCardDTO & { rank: number };

/** Table "expression aux scrutins" : construite dans le thème depuis `groupes.expression-votes` (items label=code/value=taux) + `getGroupesCards` pour le libellé complet — pas de DTO domaine dédié. */
export type GroupeExpressionTableRow = { groupeCode: string; groupeLabel: string; tauxExpressionVotes: number; rank: number };

/**
 * Table "comparaison Assemblée / population EN EMPLOI française" (pas
 * "population active", ni la population générale — voir
 * `POPULATION_FRANCAISE_PROFESSION_FAMILLE_PCT_BY_LEGISLATURE`, source Insee
 * enquête Emploi, un millésime par législature) : `pctPopulation` est `null`
 * pour une famille hors du périmètre de cette source (ex: Retraités,
 * structurellement hors population en emploi) ou pas encore renseignée — la
 * cellule affiche alors "Pas de donnée" plutôt qu'un chiffre inventé.
 */
export type ProfessionPopulationTableRow = { famille: string; pctAssemblee: number; nbAssemblee: number; pctPopulation: number | null };

/**
 * Cellule "Groupe" cliquable, colorée avec le thème du groupe (même palette
 * que `GroupCard`/les charts "parliament-group") — renvoie vers sa fiche
 * `/groupes/[code]`, pour ne pas juste balancer un classement à plat sans
 * pouvoir aller creuser un groupe précis.
 */
function GroupCell({ code, label }: { code: string; label: string }) {
    const theme = getCanonicalGroupTheme(code);
    return (
        <Link
            href={`/groupes/${code}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
        >
            {label}
        </Link>
    );
}

const KEY_FIGURES_CARDS: CardConfig[] = [
    { id: "kpi-femmes-part-actuelle", displayType: "kpi-card" },
    { id: "card-groupes-feminisation-extremes", displayType: "group-card-pair" },
    { id: "card-groupes-age-extremes", displayType: "group-card-pair" },
    { id: "card-deputes-age-extremes", displayType: "depute-card-pair" },
    { id: "card-groupes-effectifs-extremes", displayType: "group-card-pair" },
    { id: "kpi-scrutins-total-legislature", displayType: "kpi-card" },
    { id: "kpi-votes-total-legislature", displayType: "kpi-card" },
    { id: "card-groupes-expression-extremes", displayType: "group-card-pair" },
    { id: "kpi-categorie-socio-pro-dominante", displayType: "kpi-card" },
    { id: "kpi-categorie-agriculteurs", displayType: "kpi-card" },
    { id: "kpi-categorie-ouvriers", displayType: "kpi-card" },
    { id: "kpi-categorie-cadres", displayType: "kpi-card" },
    { id: "kpi-categorie-fonctionnaires", displayType: "kpi-card" },
];

const KEY_FIGURES_CHARTS: ChartConfig[] = [
    {
        id: "chart-femmes-repartition-actuelle",
        title: "Répartition actuelle à l'Assemblée",
        theme: "parity",
        displayType: "donut",
    },
    {
        id: "chart-femmes-evolution-legislatures",
        title: "Évolution depuis les débuts de la législature",
        theme: "parity",
        displayType: "line",
    },
    {
        id: "chart-positions-vote-groupes",
        title: "Répartition pour / contre / abstention par groupe (en %)",
        theme: "vote-positions",
        displayType: "stacked-bar",
    },
    {
        id: "chart-categories-socio-pro-repartition",
        title: "Répartition par catégorie socio-professionnelle",
        theme: "profession",
        displayType: "donut",
    },
];

// `TableConfig<any>[]` : ce registre mélange des tables de row-types
// différents (GroupeFeminisationTableRow, GroupeAgeTableRow, ...) — chaque
// entrée reste vérifiée individuellement via `satisfies TableConfig<X>`
// ci-dessous ; `any` ici évite juste le conflit de variance que provoquerait
// une union `TableConfig<A> | TableConfig<B>` au niveau du tableau partagé.
const KEY_FIGURES_TABLES: TableConfig<any>[] = [
    {
        id: "table-feminisation-groupes",
        columns: [
            { id: "rank", header: "N°", align: "center", cell: (r: GroupeFeminisationTableRow) => r.rank, width: 48 },
            { id: "groupe", header: "Groupe", align: "left", cell: (r: GroupeFeminisationTableRow) => <GroupCell code={r.groupeCode} label={r.groupeLabel} /> },
            { id: "taux", header: "Taux de féminisation", align: "center", cell: (r: GroupeFeminisationTableRow) => `${r.pctFemmes}%` },
            { id: "nb-femmes", header: "Nombre de femmes", align: "center", cell: (r: GroupeFeminisationTableRow) => r.nbFemmes },
            { id: "effectif", header: "Effectif du groupe", align: "center", cell: (r: GroupeFeminisationTableRow) => r.nbTotal },
        ],
        getRowKey: (r: GroupeFeminisationTableRow) => r.groupeCode,
    } satisfies TableConfig<GroupeFeminisationTableRow>,
    {
        id: "table-age-groupes",
        columns: [
            { id: "rank", header: "N°", align: "center", cell: (r: GroupeAgeTableRow) => r.rank, width: 48 },
            { id: "groupe", header: "Groupe", align: "left", cell: (r: GroupeAgeTableRow) => <GroupCell code={r.groupeCode} label={r.groupeLabel} /> },
            { id: "age-moyen", header: "Âge moyen", align: "center", cell: (r: GroupeAgeTableRow) => `${r.averageAge} ans` },
        ],
        getRowKey: (r: GroupeAgeTableRow) => r.groupeCode,
    } satisfies TableConfig<GroupeAgeTableRow>,
    {
        id: "table-effectifs-groupes",
        columns: [
            { id: "rank", header: "N°", align: "center", cell: (r: GroupeEffectifTableRow) => r.rank, width: 48 },
            { id: "groupe", header: "Groupe", align: "left", cell: (r: GroupeEffectifTableRow) => <GroupCell code={r.groupeCode} label={r.groupeLabel} /> },
            { id: "effectif", header: "Effectif", align: "center", cell: (r: GroupeEffectifTableRow) => r.groupeCountMembers },
        ],
        getRowKey: (r: GroupeEffectifTableRow) => r.groupeCode,
    } satisfies TableConfig<GroupeEffectifTableRow>,
    {
        id: "table-expression-votes-groupes",
        columns: [
            { id: "rank", header: "N°", align: "center", cell: (r: GroupeExpressionTableRow) => r.rank, width: 48 },
            { id: "groupe", header: "Groupe", align: "left", cell: (r: GroupeExpressionTableRow) => <GroupCell code={r.groupeCode} label={r.groupeLabel} /> },
            { id: "taux", header: "Taux d'expression", align: "center", cell: (r: GroupeExpressionTableRow) => `${r.tauxExpressionVotes}%` },
        ],
        getRowKey: (r: GroupeExpressionTableRow) => r.groupeCode,
    } satisfies TableConfig<GroupeExpressionTableRow>,
    {
        id: "table-categories-socio-pro-population",
        columns: [
            { id: "famille", header: "Famille socio-professionnelle", align: "left", cell: (r: ProfessionPopulationTableRow) => r.famille },
            { id: "assemblee", header: "% à l'Assemblée", align: "center", cell: (r: ProfessionPopulationTableRow) => `${r.pctAssemblee}% (${r.nbAssemblee})` },
            { id: "population", header: "% population en emploi française", align: "center", cell: (r: ProfessionPopulationTableRow) => (r.pctPopulation != null ? `${r.pctPopulation}%` : "Pas de donnée") },
        ],
        getRowKey: (r: ProfessionPopulationTableRow) => r.famille,
    } satisfies TableConfig<ProfessionPopulationTableRow>,
];

export const card = makeRegistryHelper(KEY_FIGURES_CARDS, "CardConfig");
export const chart = makeRegistryHelper(KEY_FIGURES_CHARTS, "ChartConfig");
export const table = makeRegistryHelper(KEY_FIGURES_TABLES, "TableConfig");

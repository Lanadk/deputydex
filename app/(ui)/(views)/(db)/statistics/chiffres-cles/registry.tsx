import Link from "next/link";
import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";
import { CardConfig } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";
import { TableConfig } from "@/app/(ui)/component-library/template/sections/block-section/table-config.types";
import { GroupeFeminisationRowDTO } from "@/app/domains/groupes/dto/groupes-feminisation.dto";
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
];

const KEY_FIGURES_TABLES: TableConfig<GroupeFeminisationTableRow>[] = [
    {
        id: "table-feminisation-groupes",
        columns: [
            { id: "rank", header: "N°", align: "center", cell: (r) => r.rank, width: 48 },
            { id: "groupe", header: "Groupe", align: "left", cell: (r) => <GroupCell code={r.groupeCode} label={r.groupeLabel} /> },
            { id: "taux", header: "Taux de féminisation", align: "center", cell: (r) => `${r.pctFemmes}%` },
            { id: "nb-femmes", header: "Nombre de femmes", align: "center", cell: (r) => r.nbFemmes },
            { id: "effectif", header: "Effectif du groupe", align: "center", cell: (r) => r.nbTotal },
        ],
        getRowKey: (r) => r.groupeCode,
    },
];

export const card = makeRegistryHelper(KEY_FIGURES_CARDS, "CardConfig");
export const chart = makeRegistryHelper(KEY_FIGURES_CHARTS, "ChartConfig");
export const table = makeRegistryHelper(KEY_FIGURES_TABLES, "TableConfig");

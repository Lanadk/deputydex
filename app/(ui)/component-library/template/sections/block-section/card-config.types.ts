import {ChartColorVariant} from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import {CustomProps, VariantProps} from "@/app/(ui)/component-library/atoms/badge/badge-lib";

export type KpiCardData = {
    value: string | number;
    label: string;
};

export type KpiBarCardData = {
    title?: string;
    items: KpiBarCardItem[];
    maxValue?: number;
    footer?: string;
    showFooterDivider?: boolean;
};

export type KpiBarCardItem = {
    label: string;
    value: number;
    displayValue?: string;
    color?: string;
};

export type SummaryListItem =
    | { label: string; badge: VariantProps | CustomProps }
    | { label: string; value: string | number };

export type SummaryListCardData = {
    title?: string;
    items: SummaryListItem[];
};

/**
 * Sous-ensemble de `GroupCardProps` (components/groups/group-card.tsx) —
 * `theme` en est volontairement absent : le renderer le résout lui-même
 * depuis `code` via `getCanonicalGroupTheme`, pour ne pas obliger chaque
 * `gatewayFn` à connaître le système de thème des groupes.
 */
export type GroupCardData = {
    code: string;
    libelle?: string;
    nbMembers?: number;
    president?: string;
    sexPresidentType?: string;
    position?: string;
    href?: string;
    image?: string | null;
    /** Légende affichée sous la carte (ex: "Le plus féminisé") — absente = pas de légende */
    caption?: string;
};

/**
 * Plusieurs `GroupCard` affichées ensemble, centrées, toutes à la même
 * largeur — ex: "le plus féminisé" / "le moins féminisé" côte à côte. Un
 * seul block plutôt qu'un `group-card` par carte : sinon chaque carte est un
 * item de grid indépendant (colSpan 1, 2...) et rien ne les centre ni ne les
 * aligne entre elles comme un groupe cohérent.
 */
export type GroupCardPairData = {
    cards: GroupCardData[];
};

export type CardDataWrapper =
    | { data: KpiCardData }
    | { data: KpiBarCardData }
    | { data: SummaryListCardData }
    | { data: GroupCardData }
    | { data: GroupCardPairData };

type CardConfigBase = {
    id: string;
    variant?: ChartColorVariant;
    title?: string;
    subtitle?: string;
    theme?: string;
};

export type CardConfig =
    | CardConfigBase & { displayType: 'kpi-card' }
    | CardConfigBase & { displayType: 'kpi-bar-card' }
    | CardConfigBase & { displayType: 'summary-list-card' }
    | CardConfigBase & { displayType: 'group-card' }
    | CardConfigBase & { displayType: 'group-card-pair' };
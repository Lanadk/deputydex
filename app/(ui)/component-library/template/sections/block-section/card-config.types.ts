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

/** Liens optionnels d'une ligne : `href` sur le libellé, `secondaryLink` affiché en dessous. */
type SummaryListItemLinks = {
    href?: string;
    secondaryLink?: { label: string; href: string };
};

export type SummaryListItem =
    | ({ label: string; badge: VariantProps | CustomProps } & SummaryListItemLinks)
    | ({ label: string; value: string | number } & SummaryListItemLinks);

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

/**
 * Pendant de `GroupCardData` pour un député précis (voir `DeputeMiniCard`,
 * components/deputes/depute-mini-card.tsx) — `theme` en est absent pour la
 * même raison : le renderer le résout depuis `groupeCode` via
 * `getCanonicalGroupTheme`.
 */
export type DeputeCardData = {
    uid: string;
    fullName: string;
    groupeCode: string;
    age: number;
    image?: string | null;
    href?: string;
    /** Légende affichée sous la carte (ex: "Le plus jeune") — absente = pas de légende */
    caption?: string;
};

/** Même principe que `GroupCardPairData`, pour des `DeputeCardData`. */
export type DeputeCardPairData = {
    cards: DeputeCardData[];
};

/** Badge obtenu, listé sous le verdict d'une carte de score ; la description sert d'info-bulle. */
export type ScoreCardBadge = { label: string; description?: string };

/** Score sur `max` (défaut 100) : voir `ScoreCardLib`. */
export type ScoreCardData = {
    title: string;
    score: number | null;
    max?: number;
    verdict?: string;
    caption?: string;
    /** Badge en tête de carte (ex. « Aperçu » pour des données fictives). */
    badge?: string;
    /** Badges obtenus, sous le verdict. */
    badges?: ScoreCardBadge[];
};

/** Une composante d'un score : voir `ScoreBreakdownCardLib`. */
export type ScoreBreakdownItem = {
    label: string;
    description?: string;
    /** Poids dans le score, en % */
    poids: number;
    /** Sous-score sur 100 ; null = pas de donnée */
    score: number | null;
};

/** Détail d'un score par composante : voir `ScoreBreakdownCardLib`. */
export type ScoreBreakdownCardData = {
    title?: string;
    items: ScoreBreakdownItem[];
    footer?: string;
};

export type CardDataWrapper =
    | { data: KpiCardData }
    | { data: ScoreCardData }
    | { data: ScoreBreakdownCardData }
    | { data: KpiBarCardData }
    | { data: SummaryListCardData }
    | { data: GroupCardData }
    | { data: GroupCardPairData }
    | { data: DeputeCardData }
    | { data: DeputeCardPairData };

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
    | CardConfigBase & { displayType: 'group-card-pair' }
    | CardConfigBase & { displayType: 'depute-card' }
    | CardConfigBase & { displayType: 'depute-card-pair' }
    | CardConfigBase & { displayType: 'score-card' }
    | CardConfigBase & { displayType: 'score-breakdown-card' };
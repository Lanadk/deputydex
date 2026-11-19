import { ExpandableCardItem, ExpandableCardLibProps } from "@/app/(ui)/component-library/molecules/expandable-card/expandable-card-lib";

export type ExpandableCardListSortOption<TRow> = {
    value: string;
    label: string;
    compare: (a: TRow, b: TRow) => number;
};

export type ExpandableCardListToggle<TRow> = {
    id: string;
    label: string;
    /** Quand la case est cochée, seules les lignes pour lesquelles `keep` est vrai restent affichées. */
    keep: (row: TRow) => boolean;
    /** Case cochée au premier rendu */
    defaultChecked?: boolean;
};

/**
 * Bloc "expandable-card-list" : liste de cartes dépliables (ExpandableCardLib) avec
 * recherche, tri, filtres à cocher et pagination locale. La donnée est un
 * tableau de lignes posé sous `dataMap[id]` par le `gatewayFn` de la section.
 */
export type ExpandableCardListConfig<TRow = unknown> = {
    id: string;
    title?: string;
    subtitle?: string;
    /** Taille de page (défaut : 10) */
    pageSize?: number;
    searchPlaceholder?: string;
    /** Message quand aucune ligne n'est chargée (défaut : "Aucun résultat") */
    emptyLabel?: string;
    /** Compteur de lignes affichées (défaut : "N résultat(s)") */
    countLabel?: (count: number) => string;
    /** Message quand la recherche / les filtres ne laissent aucune ligne (défaut générique) */
    noMatchLabel?: string;
    /** Texte sur lequel porte la recherche (insensible à la casse et aux accents) */
    getSearchText: (row: TRow) => string;
    /** Le premier tri est appliqué par défaut */
    sortOptions?: ExpandableCardListSortOption<TRow>[];
    toggles?: ExpandableCardListToggle<TRow>[];
    getRowKey: (row: TRow) => string;
    /** Props de la carte, hors chargement du détail */
    toCard: (row: TRow) => Omit<ExpandableCardLibProps, "loadItems">;
    /** Charge le détail d'une carte au dépliage ; reçoit les params de la page (uid, legislature…) */
    loadItems: (row: TRow, params: Record<string, unknown>) => Promise<ExpandableCardItem[]>;
};

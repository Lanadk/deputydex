import { normalizeForSearch } from "@/app/_shared/utils/string";

/**
 * Filtres de la liste des scrutins, appliqués côté serveur.
 * Toute valeur inconnue est ignorée (filtre absent) plutôt que de faire échouer la requête.
 */

export const SCRUTIN_RESULTATS = ["adopte", "rejete"] as const;
export type ScrutinResultatFilter = (typeof SCRUTIN_RESULTATS)[number];

/** Types de scrutin de l'open data AN : SPO, SPS, MOC */
export const SCRUTIN_TYPES = ["SPO", "SPS", "MOC"] as const;
export type ScrutinTypeFilter = (typeof SCRUTIN_TYPES)[number];

/** Objet du scrutin, déduit du début de son titre (voir `prisma-scrutin-list.repository.ts`). */
export const SCRUTIN_OBJETS = ["ensemble", "article", "amendement", "motion", "autre"] as const;
export type ScrutinObjet = (typeof SCRUTIN_OBJETS)[number];

/**
 * - "importants" : scrutins solennels, motions de censure et votes sur l'ensemble d'un texte
 * - "tous" : tous les scrutins de la législature
 */
export const SCRUTIN_PORTEES = ["importants", "tous"] as const;
export type ScrutinPortee = (typeof SCRUTIN_PORTEES)[number];

export const SCRUTIN_LIST_DEFAULT_PAGE_SIZE = 20;
export const SCRUTIN_LIST_MAX_PAGE_SIZE = 50;

export type ScrutinListFilters = {
    legislature: number;
    portee: ScrutinPortee;
    /** Déjà normalisée : minuscules, sans accents (voir `normalizeForSearch`) */
    recherche: string | null;
    resultat: ScrutinResultatFilter | null;
    type: ScrutinTypeFilter | null;
    objet: ScrutinObjet | null;
    page: number;
    pageSize: number;
};

/** Paramètres bruts (ex. query string), tous optionnels. */
export type ScrutinListRawParams = Partial<Record<"portee" | "q" | "resultat" | "type" | "objet" | "page" | "pageSize", string | null>>;

function oneOf<T extends string>(values: readonly T[], value: string | null | undefined): T | null {
    return value && (values as readonly string[]).includes(value) ? (value as T) : null;
}

function positiveInt(value: string | null | undefined, fallback: number): number {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 ? n : fallback;
}

function normalizeRecherche(value: string | null | undefined): string | null {
    return normalizeForSearch(value ?? "") || null;
}

export function parseScrutinListFilters(legislature: number, raw: ScrutinListRawParams): ScrutinListFilters {
    return {
        legislature,
        portee: oneOf(SCRUTIN_PORTEES, raw.portee) ?? "importants",
        recherche: normalizeRecherche(raw.q),
        resultat: oneOf(SCRUTIN_RESULTATS, raw.resultat),
        type: oneOf(SCRUTIN_TYPES, raw.type),
        objet: oneOf(SCRUTIN_OBJETS, raw.objet),
        page: positiveInt(raw.page, 1),
        pageSize: Math.min(positiveInt(raw.pageSize, SCRUTIN_LIST_DEFAULT_PAGE_SIZE), SCRUTIN_LIST_MAX_PAGE_SIZE),
    };
}

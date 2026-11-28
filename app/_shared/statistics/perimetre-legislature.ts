/**
 * Périmètre de législature d'une stat : une législature précise (son numéro)
 * ou toutes les législatures présentes dans les données, combinées. Valeur
 * partagée serveur / client, posée dans `filters.legislature` du contexte.
 *
 * Rien n'y est propre à une législature : « toutes » couvre ce que
 * `param_legislatures` et les vues contiennent, une nouvelle législature y
 * entre d'elle-même. Côté données, c'est le niveau `legislature IS NULL` des
 * vues `agg_assemblee_presence*` (voir deputydex-data,
 * src/sql/scripts/presence/README.md).
 */
export const TOUTES_LEGISLATURES = "toutes" as const;

export type PerimetreLegislature = number | typeof TOUTES_LEGISLATURES;

/** `filters.legislature` → périmètre valide, ou `undefined` (absent ou invalide). */
export function lirePerimetreLegislature(valeur: unknown): PerimetreLegislature | undefined {
    if (valeur === TOUTES_LEGISLATURES) return TOUTES_LEGISLATURES;
    if (typeof valeur === "number" && Number.isInteger(valeur) && valeur > 0) return valeur;
    return undefined;
}

export const estToutesLegislatures = (valeur: unknown): boolean => valeur === TOUTES_LEGISLATURES;

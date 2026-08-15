import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";

/**
 * Un contexte est "vide" quand il ne porte plus aucun filtre ni entité —
 * ni ce qu'un scope "entity" attend (`entityId`), ni ce qu'un scope
 * "aggregate" attend (`filters` non-vide). Utilisé par RESET_CONTEXT
 * (comparator.reducer.ts) pour savoir si TOUS les contextes sont désormais
 * vides — auquel cas la contrainte domaine/scope (verrouillée via
 * `selectedStatIds`, voir comparator.types.ts) n'a plus lieu d'être : plus
 * rien n'est affiché nulle part, rien n'empêche de repartir sur un autre
 * domaine.
 */
export function isEmptyContext(context: StatFetchParams): boolean {
    const hasEntity = !!context.entityId;
    const hasFilters = !!context.filters && Object.keys(context.filters).length > 0;
    return !hasEntity && !hasFilters;
}

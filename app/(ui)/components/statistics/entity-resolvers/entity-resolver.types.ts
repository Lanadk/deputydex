import React from "react";
import { StatFetchParams, StatScope } from "@/app/_shared/statistics/stat-scope.types";

export interface EntityResolverProps {
    /** contexte en cours d'édition (StatFetchParams) pour CE contexte de comparaison */
    value: StatFetchParams;
    /** scope actuellement résolu par ce picker : "entity" (un élément précis) ou "aggregate" (une population) */
    scope: StatScope;
    onChange: (scope: StatScope, params: StatFetchParams) => void;
    /**
     * Si non-null, bride le toggle entity/aggregate : imposé par
     * `selectedStatIds` déjà choisis (même règle que le domaine dans
     * StatPicker — l'incompatibilité est rendue impossible à atteindre,
     * pas corrigée après coup).
     */
    lockedScope?: StatScope | null;
    /**
     * Contexte de l'AUTRE colonne en comparaison — `null` hors comparaison,
     * ou tant que cette autre colonne n'a encore rien choisi. Sert à griser
     * la valeur qui y est déjà sélectionnée (même législature, même entité) :
     * comparer une valeur à elle-même n'a pas de sens, ce resolver doit donc
     * rendre ce choix impossible à atteindre plutôt que de le corriger après
     * coup (même principe que `lockedScope`/StatPicker).
     */
    otherContext?: StatFetchParams | null;
}

export type EntityResolver = React.FC<EntityResolverProps>;

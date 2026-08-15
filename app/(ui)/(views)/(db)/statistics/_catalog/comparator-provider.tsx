"use client";

import React, { createContext, useContext, useReducer } from "react";
import { comparatorReducer } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.reducer";
import {
    ChartDisplayType,
    ComparatorAction,
    ComparatorState,
    INITIAL_COMPARATOR_STATE,
} from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";

interface ComparatorContextValue {
    state: ComparatorState;
    toggleStat: (definitionId: string) => void;
    clearSelection: () => void;
    enableSplit: () => void;
    disableSplit: () => void;
    updateContext: (contextIndex: number, params: StatFetchParams) => void;
    resetContext: (contextIndex: number) => void;
    setDisplayType: (contextIndex: number, definitionId: string, displayType: ChartDisplayType) => void;
}

const ComparatorContext = createContext<ComparatorContextValue>({
    state: INITIAL_COMPARATOR_STATE,
    toggleStat: () => {},
    clearSelection: () => {},
    enableSplit: () => {},
    disableSplit: () => {},
    updateContext: () => {},
    resetContext: () => {},
    setDisplayType: () => {},
});

/**
 * Porte l'état du hub Statistiques : les stats sélectionnées par
 * exploration (`selectedStatIds`) + 1 ou 2 contextes (single/split) sous
 * lesquels elles sont rejouées. Un seul provider pour toute la page — le
 * picker et les `StatViewer` (à venir) consomment `useComparator()` sans se
 * soucier du mode.
 */
// useReducer exige un reducer à exactement 2 paramètres — comparatorReducer
// prend un 3ᵉ paramètre `catalog` optionnel (injectable en tests, voir
// comparator.reducer.ts), d'où ce wrapper qui laisse jouer sa valeur par défaut.
function reduceComparator(state: ComparatorState, action: ComparatorAction): ComparatorState {
    return comparatorReducer(state, action);
}

export function ComparatorProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reduceComparator, INITIAL_COMPARATOR_STATE);

    const value: ComparatorContextValue = {
        state,
        toggleStat: (definitionId) => dispatch({ type: "TOGGLE_STAT", definitionId }),
        clearSelection: () => dispatch({ type: "CLEAR_SELECTION" }),
        enableSplit: () => dispatch({ type: "ENABLE_SPLIT" }),
        disableSplit: () => dispatch({ type: "DISABLE_SPLIT" }),
        updateContext: (contextIndex, params) => dispatch({ type: "UPDATE_CONTEXT", contextIndex, params }),
        resetContext: (contextIndex) => dispatch({ type: "RESET_CONTEXT", contextIndex }),
        setDisplayType: (contextIndex, definitionId, displayType) =>
            dispatch({ type: "SET_DISPLAY_TYPE", contextIndex, definitionId, displayType }),
    };

    return <ComparatorContext.Provider value={value}>{children}</ComparatorContext.Provider>;
}

export const useComparator = () => useContext(ComparatorContext);

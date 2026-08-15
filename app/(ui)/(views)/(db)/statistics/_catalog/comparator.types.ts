import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { ChartConfig } from "@/app/(ui)/component-library/template/sections/block-section/chart-config.types";

export type ChartDisplayType = ChartConfig["displayType"];

export type ComparatorMode = "single" | "split";

/**
 * Le comparateur ne compare pas "stat A vs stat B" mais UN MÊME ensemble de
 * stats (choisies par exploration, même domain+scope entre elles) rejoué
 * sous 1 ou 2 contextes — ex: groupe X vs groupe Y, législature 16 vs 17,
 * député A vs député B. `displayTypes` est indexé par contexte ET par stat :
 * le format est configurable indépendamment des deux côtés (flexibilité
 * voulue), même si dupliqué par défaut au moment du split pour partir d'un
 * état identique des deux côtés.
 */
export interface ComparatorState {
    mode: ComparatorMode;
    /** ids StatDefinition sélectionnés par exploration — tous même domain+scope */
    selectedStatIds: string[];
    /** length 1 en "single", length 2 en "split" */
    contexts: StatFetchParams[];
    /** displayTypes[contextIndex][definitionId] = format choisi ; absent = défaut (1er format compatible) */
    displayTypes: Record<string, ChartDisplayType>[];
}

export const INITIAL_COMPARATOR_STATE: ComparatorState = {
    mode: "single",
    selectedStatIds: [],
    contexts: [{}],
    displayTypes: [{}],
};

export type ComparatorAction =
    | { type: "TOGGLE_STAT"; definitionId: string }
    | { type: "CLEAR_SELECTION" }
    | { type: "ENABLE_SPLIT" }
    | { type: "DISABLE_SPLIT" }
    | { type: "UPDATE_CONTEXT"; contextIndex: number; params: StatFetchParams }
    | { type: "RESET_CONTEXT"; contextIndex: number }
    | { type: "SET_DISPLAY_TYPE"; contextIndex: number; definitionId: string; displayType: ChartDisplayType };

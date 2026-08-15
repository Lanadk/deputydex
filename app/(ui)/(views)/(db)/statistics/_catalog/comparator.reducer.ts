import { STATS_CATALOG } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog";
import { StatDomainModule } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-domain.types";
import { findStatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stats-catalog.helpers";
import { ComparatorAction, ComparatorState } from "@/app/(ui)/(views)/(db)/statistics/_catalog/comparator.types";
import { isEmptyContext } from "@/app/(ui)/(views)/(db)/statistics/_catalog/is-empty-context";

/**
 * L'incompatibilité (domain/scope différent du reste de `selectedStatIds`)
 * est rendue IMPOSSIBLE à atteindre plutôt que corrigée après coup :
 * TOGGLE_STAT ignore silencieusement tout ajout incompatible et retourne le
 * state inchangé. Le picker UI doit lui-même filtrer avec
 * `getComparableStats` pour ne jamais proposer ce choix — ce garde-fou n'est
 * qu'une deuxième ligne de défense (l'action peut être appelée directement,
 * hors du picker).
 *
 * `catalog` est injectable (tests) et vaut STATS_CATALOG par défaut — la
 * signature reste un reducer standard à 2 arguments pour useReducer.
 */
export function comparatorReducer(
    state: ComparatorState,
    action: ComparatorAction,
    catalog: StatDomainModule[] = STATS_CATALOG
): ComparatorState {
    switch (action.type) {
        case "TOGGLE_STAT": {
            const alreadySelected = state.selectedStatIds.includes(action.definitionId);

            if (alreadySelected) {
                const selectedStatIds = state.selectedStatIds.filter((id) => id !== action.definitionId);
                const displayTypes = state.displayTypes.map((byStat) => {
                    if (!(action.definitionId in byStat)) return byStat;
                    const rest = { ...byStat };
                    delete rest[action.definitionId];
                    return rest;
                });
                return { ...state, selectedStatIds, displayTypes };
            }

            const definition = findStatDefinition(catalog, action.definitionId);
            if (!definition) return state;

            const referenceId = state.selectedStatIds[0];
            if (referenceId) {
                const reference = findStatDefinition(catalog, referenceId);
                const isCompatible =
                    !!reference && reference.domain === definition.domain && reference.scope === definition.scope;
                if (!isCompatible) return state;
            }

            return { ...state, selectedStatIds: [...state.selectedStatIds, action.definitionId] };
        }

        case "CLEAR_SELECTION": {
            return {
                ...state,
                selectedStatIds: [],
                displayTypes: state.displayTypes.map(() => ({})),
            };
        }

        case "ENABLE_SPLIT": {
            if (state.mode === "split") return state;
            return {
                ...state,
                mode: "split",
                // Le contexte B démarre VIDE, pas cloné : le domaine/scope
                // restent verrouillés via selectedStatIds (indépendant de
                // `context`), mais les filtres de comparaison eux-mêmes
                // (législature, entité...) doivent être choisis par
                // l'utilisateur pour ce côté — sinon les deux colonnes
                // affichent la même donnée le temps qu'il les édite.
                contexts: [state.contexts[0], {}],
                // displayTypes, lui, reste cloné : le format d'un chart n'est
                // pas un filtre de comparaison, comparer un bar à un donut
                // n'aurait pas de sens par défaut (reste éditable ensuite).
                displayTypes: [state.displayTypes[0], { ...state.displayTypes[0] }],
            };
        }

        case "DISABLE_SPLIT": {
            if (state.mode === "single") return state;
            return {
                ...state,
                mode: "single",
                contexts: [state.contexts[0]],
                displayTypes: [state.displayTypes[0]],
            };
        }

        case "UPDATE_CONTEXT": {
            if (!state.contexts[action.contextIndex]) return state;
            const contexts = [...state.contexts];
            contexts[action.contextIndex] = action.params;
            return { ...state, contexts };
        }

        case "RESET_CONTEXT": {
            if (!state.contexts[action.contextIndex]) return state;
            const contexts = [...state.contexts];
            contexts[action.contextIndex] = {};

            // Tant qu'il reste au moins un contexte non-vide, la contrainte
            // domaine/scope garde son sens (l'autre colonne affiche encore un
            // graphe pour selectedStatIds) — on ne touche qu'au contexte visé,
            // comme UPDATE_CONTEXT.
            if (!contexts.every(isEmptyContext)) {
                return { ...state, contexts };
            }

            // Tous les contextes sont désormais vides : plus rien n'est
            // affiché nulle part, la contrainte domaine/scope verrouillée via
            // selectedStatIds n'a plus lieu d'être — on repart d'une sélection
            // vierge pour pouvoir choisir un autre domaine.
            return {
                ...state,
                contexts,
                selectedStatIds: [],
                displayTypes: state.displayTypes.map(() => ({})),
            };
        }

        case "SET_DISPLAY_TYPE": {
            if (!state.contexts[action.contextIndex]) return state;
            const displayTypes = [...state.displayTypes];
            displayTypes[action.contextIndex] = {
                ...displayTypes[action.contextIndex],
                [action.definitionId]: action.displayType,
            };
            return { ...state, displayTypes };
        }

        default:
            return state;
    }
}

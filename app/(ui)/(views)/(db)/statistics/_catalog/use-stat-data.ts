import { useEffect, useReducer } from "react";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { fetchStatData } from "@/app/(ui)/(views)/(db)/statistics/_catalog/fetch-stat-data";
import { isContextReady } from "@/app/(ui)/(views)/(db)/statistics/_catalog/is-context-ready";

type State = { data: RawStatData | null; loading: boolean };
type Action = { type: "FETCH_START" } | { type: "FETCH_SUCCESS"; payload: RawStatData };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "FETCH_START":
            return { data: null, loading: true };
        case "FETCH_SUCCESS":
            return { data: action.payload, loading: false };
    }
}

/**
 * Fetch d'UNE stat pour un contexte donné — même mécanique que
 * useFetchSectionData (app/(ui)/_shared/hook/useSectionData.ts), à l'échelle
 * d'une stat au lieu d'une section entière. Réagit à un changement de
 * contexte (filtres/entityId) via un JSON.stringify comme clé de dépendance.
 *
 * Ne fetch jamais tant que le contexte n'est pas prêt (voir
 * is-context-ready.ts) — un contexte fraîchement ouvert en comparaison
 * (entityId/legislature pas encore choisis côté B) ne doit jamais taper le
 * serveur avec des paramètres incomplets.
 */
export function useStatData(definition: StatDefinition, params: StatFetchParams) {
    const [{ data, loading }, dispatch] = useReducer(reducer, { data: null, loading: false });
    const paramsKey = JSON.stringify(params);
    const ready = isContextReady(definition.domain, definition.scope, params);

    useEffect(() => {
        if (!ready) return;

        let cancelled = false;
        dispatch({ type: "FETCH_START" });

        fetchStatData(definition, params).then((payload) => {
            if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload });
        });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [definition.id, paramsKey, ready]);

    // Masque les data/loading d'un contexte précédemment prêt si le contexte
    // redevient incomplet (ex: entité effacée) — pas de dispatch("RESET")
    // synchrone dans l'effet ci-dessus (react-hooks/set-state-in-effect).
    return ready ? { data, loading } : { data: null, loading: false };
}

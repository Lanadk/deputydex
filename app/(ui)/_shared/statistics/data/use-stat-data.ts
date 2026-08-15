import { useEffect, useReducer, useState } from "react";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { fetchStatData } from "@/app/(ui)/_shared/statistics/data/fetch-stat-data";
import { isContextReady } from "@/app/(ui)/_shared/statistics/context/is-context-ready";

type State = { data: RawStatData | null; loading: boolean; error: boolean };
type Action =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: RawStatData }
    | { type: "FETCH_ERROR" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "FETCH_START":
            return { data: null, loading: true, error: false };
        case "FETCH_SUCCESS":
            return { data: action.payload, loading: false, error: false };
        case "FETCH_ERROR":
            return { data: null, loading: false, error: true };
    }
}

const INITIAL_STATE: State = { data: null, loading: false, error: false };

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
 *
 * `fetchStatData` peut rejeter (réseau coupé, 500 côté serveur, JSON
 * invalide) — capturé ici en `error`, jamais laissé remonter en rejet de
 * promesse non géré, sinon `loading` resterait bloqué à `true` indéfiniment
 * côté StatViewer (voir historique : ce cas n'était pas géré avant). `retry`
 * rejoue le même fetch en incrémentant une clé d'effet dédiée.
 */
export function useStatData(definition: StatDefinition, params: StatFetchParams) {
    const [{ data, loading, error }, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [retryToken, setRetryToken] = useState(0);
    const retry = () => setRetryToken((n) => n + 1);
    const paramsKey = JSON.stringify(params);
    const ready = isContextReady(definition.domain, definition.scope, params);

    useEffect(() => {
        if (!ready) return;

        let cancelled = false;
        dispatch({ type: "FETCH_START" });

        fetchStatData(definition, params)
            .then((payload) => {
                if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload });
            })
            .catch(() => {
                if (!cancelled) dispatch({ type: "FETCH_ERROR" });
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [definition.id, paramsKey, ready, retryToken]);

    // Masque les data/loading/error d'un contexte précédemment prêt si le
    // contexte redevient incomplet (ex: entité effacée) — pas de
    // dispatch("RESET") synchrone dans l'effet ci-dessus
    // (react-hooks/set-state-in-effect).
    return ready ? { data, loading, error, retry } : { data: null, loading: false, error: false, retry };
}

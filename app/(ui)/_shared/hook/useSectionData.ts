import {useCallback, useEffect, useReducer, useState} from "react";
import {
    BlockDataWrapper,
} from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";


type State = {
    dataMap: Record<string, BlockDataWrapper>;
    loading: boolean;
    error: boolean;
};

type Action =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: Record<string, BlockDataWrapper> }
    | { type: "FETCH_ERROR" };

function reducer(_state: State, action: Action): State {
    switch (action.type) {
        case "FETCH_START":
            return { dataMap: {}, loading: true, error: false };
        case "FETCH_SUCCESS":
            return { dataMap: action.payload, loading: false, error: false };
        case "FETCH_ERROR":
            return { dataMap: {}, loading: false, error: true };
    }
}

/**
 * Charge les données d'une section (son `gatewayFn`). Un échec (réseau, erreur
 * serveur) passe en `error` — jamais un rejet de promesse non géré qui
 * laisserait la section vide — et `retry` rejoue le chargement. Une réponse
 * arrivée après un changement de paramètres est ignorée.
 */
export function useFetchSectionData(
    gatewayFn: ((params: Record<string, unknown>) => Promise<Record<string, BlockDataWrapper>>) | undefined,
    params: Record<string, unknown>
) {
    const [{ dataMap, loading, error }, dispatch] = useReducer(reducer, { dataMap: {}, loading: false, error: false });
    const [retryToken, setRetryToken] = useState(0);
    const retry = useCallback(() => setRetryToken((n) => n + 1), []);

    const paramsKey = JSON.stringify(params);

    useEffect(() => {
        if (!gatewayFn) {
            dispatch({ type: "FETCH_SUCCESS", payload: {} });
            return;
        }
        let cancelled = false;
        dispatch({ type: "FETCH_START" });
        gatewayFn(params)
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
    }, [paramsKey, retryToken]);

    return { dataMap, loading, error, retry };
}

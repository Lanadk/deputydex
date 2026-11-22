import { useCallback, useEffect, useReducer, useState } from "react";

type State<T> = { data: T | undefined; loading: boolean; error: boolean };
type Action<T> =
    | { type: "START" }
    | { type: "SUCCESS"; payload: T }
    | { type: "ERROR" };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
        case "START":
            return { data: state.data, loading: true, error: false };
        case "SUCCESS":
            return { data: action.payload, loading: false, error: false };
        case "ERROR":
            return { data: undefined, loading: false, error: true };
    }
}

export type AsyncData<T> = {
    data: T | undefined;
    loading: boolean;
    /** Le chargement a échoué (réseau, erreur serveur) : à distinguer d'un résultat vide. */
    error: boolean;
    /** Relance le même chargement. */
    retry: () => void;
};

/**
 * Charge une donnée côté client et expose les trois états à afficher :
 * chargement, erreur (avec `retry`), données. Même mécanique que
 * `useStatData` : une réponse arrivée après un changement de `key` (ou un
 * démontage) est ignorée.
 *
 * `fetcher` à `null` : rien à charger pour l'instant (ex. législature pas
 * encore connue) — l'état reste « en chargement », sans requête.
 * `key` : identifie la requête (ex. `${code}|${legislature}`) ; la changer relance le chargement.
 */
export function useAsyncData<T>(fetcher: (() => Promise<T>) | null, key: string): AsyncData<T> {
    const [state, dispatch] = useReducer(reducer<T>, { data: undefined, loading: true, error: false });
    const [retryToken, setRetryToken] = useState(0);
    const retry = useCallback(() => setRetryToken((n) => n + 1), []);
    const enabled = fetcher !== null;

    useEffect(() => {
        if (!fetcher) return;
        let cancelled = false;
        dispatch({ type: "START" });
        fetcher()
            .then((payload) => {
                if (!cancelled) dispatch({ type: "SUCCESS", payload });
            })
            .catch(() => {
                if (!cancelled) dispatch({ type: "ERROR" });
            });
        return () => {
            cancelled = true;
        };
        // `fetcher` est en général recréé à chaque rendu : c'est `key` qui identifie la requête.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, key, retryToken]);

    return { ...state, retry };
}

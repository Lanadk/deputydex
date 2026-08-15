import { useEffect, useReducer } from "react";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { fetchStatData } from "@/app/(ui)/(views)/(db)/statistics/_catalog/fetch-stat-data";

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
 */
export function useStatData(definition: StatDefinition, params: StatFetchParams) {
    const [{ data, loading }, dispatch] = useReducer(reducer, { data: null, loading: false });
    const paramsKey = JSON.stringify(params);

    useEffect(() => {
        let cancelled = false;
        dispatch({ type: "FETCH_START" });

        fetchStatData(definition, params).then((payload) => {
            if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload });
        });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [definition.id, paramsKey]);

    return { data, loading };
}

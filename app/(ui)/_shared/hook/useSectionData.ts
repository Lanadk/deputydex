import {useEffect, useReducer} from "react";
import {
    BlockDataWrapper,
} from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";


type State = {
    dataMap: Record<string, BlockDataWrapper>;
    loading: boolean;
};

type Action =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: Record<string, BlockDataWrapper> };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "FETCH_START":
            return { dataMap: {}, loading: true };
        case "FETCH_SUCCESS":
            return { dataMap: action.payload, loading: false };
    }
}

export function useFetchSectionData(
    gatewayFn: ((params: Record<string, unknown>) => Promise<Record<string, BlockDataWrapper>>) | undefined,
    params: Record<string, unknown>
) {
    const [{ dataMap, loading }, dispatch] = useReducer(reducer, { dataMap: {}, loading: false });

    const paramsKey = JSON.stringify(params);

    useEffect(() => {
        if (!gatewayFn) {
            dispatch({ type: "FETCH_SUCCESS", payload: {} });
            return;
        }
        dispatch({ type: "FETCH_START" });
        gatewayFn(params)
            .then((payload) => dispatch({ type: "FETCH_SUCCESS", payload }));
    }, [paramsKey]);

    return { dataMap, loading };
}
import {useEffect, useReducer} from "react";
import {
    BlockDataWrapper,
} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";


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
    gatewayFn: ((legislature: number) => Promise<Record<string, BlockDataWrapper>>) | undefined,
    legislature: number
) {
    const [{ dataMap, loading }, dispatch] = useReducer(reducer, { dataMap: {}, loading: false });

    useEffect(() => {
        if (!gatewayFn) {
            dispatch({ type: "FETCH_SUCCESS", payload: {} });
            return;
        }
        dispatch({ type: "FETCH_START" });
        gatewayFn(legislature)
            .then((payload) => dispatch({ type: "FETCH_SUCCESS", payload }));
    }, [legislature]);

    return { dataMap, loading };
}
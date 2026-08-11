import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetchSectionData } from "@/app/(ui)/_shared/hook/useSectionData";

function deferred<T>() {
    let resolve!: (v: T) => void;
    const promise = new Promise<T>((res) => {
        resolve = res;
    });
    return { promise, resolve };
}

describe("useFetchSectionData", () => {
    it("resolves to an empty, non-loading state when no gatewayFn is provided", async () => {
        const { result } = renderHook(() => useFetchSectionData(undefined, {}));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.dataMap).toEqual({});
    });

    it("sets loading=true while the gatewayFn promise is pending, then resolves with its payload", async () => {
        const { promise, resolve } = deferred<Record<string, unknown>>();
        const gatewayFn = jest.fn().mockReturnValue(promise);

        const { result } = renderHook(() => useFetchSectionData(gatewayFn as any, { legislature: 17 }));

        await waitFor(() => expect(result.current.loading).toBe(true));
        expect(gatewayFn).toHaveBeenCalledWith({ legislature: 17 });

        await act(async () => {
            resolve({ foo: ["bar"] });
            await promise;
        });

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.dataMap).toEqual({ foo: ["bar"] });
    });

    it("refetches when params change", async () => {
        const gatewayFn = jest
            .fn()
            .mockResolvedValueOnce({ a: [1] })
            .mockResolvedValueOnce({ b: [2] });

        const { result, rerender } = renderHook(
            ({ params }) => useFetchSectionData(gatewayFn as any, params),
            { initialProps: { params: { legislature: 17 } as Record<string, unknown> } }
        );

        await waitFor(() => expect(result.current.dataMap).toEqual({ a: [1] }));

        rerender({ params: { legislature: 18 } });

        await waitFor(() => expect(result.current.dataMap).toEqual({ b: [2] }));
        expect(gatewayFn).toHaveBeenCalledTimes(2);
    });

    it("does not refetch when a new params object is deeply equal to the previous one", async () => {
        const gatewayFn = jest.fn().mockResolvedValue({ a: [1] });

        const { rerender } = renderHook(
            ({ params }) => useFetchSectionData(gatewayFn as any, params),
            { initialProps: { params: { legislature: 17 } as Record<string, unknown> } }
        );

        await waitFor(() => expect(gatewayFn).toHaveBeenCalledTimes(1));

        // Nouvel objet, même contenu — la clé de dépendance (JSON.stringify)
        // ne change pas, donc pas de refetch attendu.
        rerender({ params: { legislature: 17 } });

        await new Promise((r) => setTimeout(r, 0));
        expect(gatewayFn).toHaveBeenCalledTimes(1);
    });
});

import { act, renderHook, waitFor } from "@testing-library/react";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";

function deferred<T>() {
    let resolve!: (v: T) => void;
    let reject!: (e: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

describe("useAsyncData", () => {
    it("charge puis expose les données", async () => {
        const { result } = renderHook(() => useAsyncData(() => Promise.resolve([1, 2]), "k"));

        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.data).toEqual([1, 2]));
        expect(result.current).toMatchObject({ loading: false, error: false });
    });

    it("passe en erreur quand le chargement échoue, sans rejet non géré", async () => {
        const { result } = renderHook(() => useAsyncData(() => Promise.reject(new Error("500")), "k"));

        await waitFor(() => expect(result.current.error).toBe(true));
        expect(result.current).toMatchObject({ loading: false, data: undefined });
    });

    it("retry relance le même chargement", async () => {
        const fetcher = jest.fn().mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce("ok");
        const { result } = renderHook(() => useAsyncData(fetcher, "k"));

        await waitFor(() => expect(result.current.error).toBe(true));
        act(() => result.current.retry());

        await waitFor(() => expect(result.current.data).toBe("ok"));
        expect(result.current.error).toBe(false);
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it("sans fetcher : en attente, sans requête", () => {
        const { result } = renderHook(() => useAsyncData<string>(null, "k"));

        expect(result.current).toMatchObject({ loading: true, error: false, data: undefined });
    });

    it("ignore une réponse arrivée après un changement de clé", async () => {
        const first = deferred<string>();
        const { result, rerender } = renderHook(
            ({ key, fetcher }) => useAsyncData(fetcher, key),
            { initialProps: { key: "a", fetcher: () => first.promise } }
        );

        rerender({ key: "b", fetcher: () => Promise.resolve("b") });
        await waitFor(() => expect(result.current.data).toBe("b"));

        await act(async () => {
            first.resolve("a");
            await first.promise;
        });
        expect(result.current.data).toBe("b");
    });
});

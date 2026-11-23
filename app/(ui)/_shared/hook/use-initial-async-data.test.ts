import { renderHook, waitFor } from "@testing-library/react";
import { useInitialAsyncData } from "@/app/(ui)/_shared/hook/use-initial-async-data";

describe("useInitialAsyncData", () => {
    it("donnée serveur présente : renvoyée telle quelle, sans requête", () => {
        const fetcher = jest.fn();

        const { result } = renderHook(() => useInitialAsyncData({ n: 1 }, fetcher, "k"));

        expect(result.current).toEqual(expect.objectContaining({ data: { n: 1 }, loading: false, error: false }));
        expect(fetcher).not.toHaveBeenCalled();
    });

    it("donnée serveur absente : chargée côté client", async () => {
        const fetcher = jest.fn().mockResolvedValue({ n: 2 });

        const { result } = renderHook(() => useInitialAsyncData<{ n: number }>(null, fetcher, "k"));

        await waitFor(() => expect(result.current.data).toEqual({ n: 2 }));
        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("donnée serveur absente et chargement client en échec : erreur, avec « Réessayer »", async () => {
        const fetcher = jest.fn().mockRejectedValue(new Error("500"));

        const { result } = renderHook(() => useInitialAsyncData<number>(null, fetcher, "k"));

        await waitFor(() => expect(result.current.error).toBe(true));
    });
});

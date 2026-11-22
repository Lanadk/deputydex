/**
 * @jest-environment node
 */

// Cache ACTIF (le TTL réel du repo peut valoir NO_CACHE) et faux `unstable_cache`
// qui, comme le vrai, mémorise un résultat par clé mais ne garde rien quand la
// fonction lève une exception.
jest.mock("@/app/_shared/cache/cache.config", () => ({
    CACHE_TTL_SECONDS: { NO_CACHE: 0, DAY: 86400, WEEK: 604800 },
    ACTIVE_CACHE_TTL_SECONDS: 604800,
    PARLIAMENT_DATA_CACHE_TAG: "parliament-data",
}));

const store = new Map<string, unknown>();
jest.mock("next/cache", () => ({
    unstable_cache: (fn: () => Promise<unknown>, keyParts: string[]) => async () => {
        const key = keyParts.join("|");
        if (store.has(key)) return store.get(key);
        const value = await fn();
        store.set(key, value);
        return value;
    },
}));

import { cachedResult } from "@/app/_shared/cache/cached-response";
import { err, ok } from "@/app/_shared/result-pattern/result";

describe("cachedResult", () => {
    beforeEach(() => store.clear());

    it("caches a success: the use-case runs once for two reads", async () => {
        const useCase = jest.fn().mockResolvedValue(ok(42));

        await cachedResult(useCase, ["k"]);
        const second = await cachedResult(useCase, ["k"]);

        expect(second).toEqual(ok(42));
        expect(useCase).toHaveBeenCalledTimes(1);
    });

    it("caches a business error (NOT_FOUND)", async () => {
        const useCase = jest.fn().mockResolvedValue(err("NOT_FOUND"));

        await cachedResult(useCase, ["k"]);
        const second = await cachedResult(useCase, ["k"]);

        expect(second).toEqual(err("NOT_FOUND"));
        expect(useCase).toHaveBeenCalledTimes(1);
    });

    it("returns DB_ERROR without caching it: the next read retries", async () => {
        const useCase = jest.fn()
            .mockResolvedValueOnce(err("DB_ERROR"))
            .mockResolvedValueOnce(ok("rétabli"));

        const first = await cachedResult(useCase, ["k"]);
        const second = await cachedResult(useCase, ["k"]);

        expect(first).toEqual(err("DB_ERROR"));
        expect(second).toEqual(ok("rétabli"));
        expect(useCase).toHaveBeenCalledTimes(2);
    });

    it("lets an unexpected exception propagate", async () => {
        const useCase = jest.fn().mockRejectedValue(new Error("boom"));

        await expect(cachedResult(useCase, ["k"])).rejects.toThrow("boom");
    });
});

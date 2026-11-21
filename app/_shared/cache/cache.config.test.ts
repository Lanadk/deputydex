import { CACHE_TTL_SECONDS, resolveCacheTtl } from "@/app/_shared/cache/cache.config";

describe("resolveCacheTtl", () => {
    const ttl = (nodeEnv: string | undefined, devPerfEnabled = false, devPerfCache?: string) =>
        resolveCacheTtl({ nodeEnv, devPerfEnabled, devPerfCache });

    it("met en cache 1 jour en production (filet de sécurité si l'invalidation après import échoue)", () => {
        expect(ttl("production")).toBe(CACHE_TTL_SECONDS.DAY);
    });

    it("ne met rien en cache en dev ni en test", () => {
        expect(ttl("development")).toBe(CACHE_TTL_SECONDS.NO_CACHE);
        expect(ttl("test")).toBe(CACHE_TTL_SECONDS.NO_CACHE);
        expect(ttl(undefined)).toBe(CACHE_TTL_SECONDS.NO_CACHE);
    });

    it("outil de perf : DEV_PERF_CACHE=true force le cache, =false le coupe", () => {
        expect(ttl("development", true, "true")).toBe(CACHE_TTL_SECONDS.DAY);
        expect(ttl("production", true, "false")).toBe(CACHE_TTL_SECONDS.NO_CACHE);
        expect(ttl("production", true, undefined)).toBe(CACHE_TTL_SECONDS.DAY);
    });

    it("ignore DEV_PERF_CACHE sans l'outil de perf (production)", () => {
        expect(ttl("production", false, "false")).toBe(CACHE_TTL_SECONDS.DAY);
        expect(ttl("development", false, "true")).toBe(CACHE_TTL_SECONDS.NO_CACHE);
    });
});

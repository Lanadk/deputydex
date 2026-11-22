import { buildServerTiming, parseServerTiming } from "@/app/_shared/dev-perf/dev-perf.timing";

describe("Server-Timing de l'outil de perf", () => {
    it("écrit un en-tête ASCII lisible par l'onglet Network", () => {
        const header = buildServerTiming({ totalMs: 42.345, sqlMs: 30.01, sqlCount: 3, cacheHit: false });

        expect(header).toBe('total;dur=42.3, db;dur=30.0;desc="3 SQL", cache;desc="miss"');
        expect(/^[\x20-\x7E]*$/.test(header)).toBe(true);
    });

    it("nomme la requête mesurée, pour rattacher la durée réseau du navigateur", () => {
        const header = buildServerTiming({ totalMs: 1, sqlMs: 1, sqlCount: 1, cacheHit: false }, "groupe-cohesion");

        expect(header.endsWith(', endpoint;desc="groupe-cohesion"')).toBe(true);
    });

    it("relit l'en-tête qu'il a écrit (aller-retour)", () => {
        const values = { totalMs: 12.5, sqlMs: 0, sqlCount: 0, cacheHit: true };

        expect(parseServerTiming(buildServerTiming(values))).toEqual(values);
    });

    it("renvoie null pour un en-tête absent ou d'une autre forme", () => {
        expect(parseServerTiming(null)).toBeNull();
        expect(parseServerTiming("app;dur=12")).toBeNull();
    });
});

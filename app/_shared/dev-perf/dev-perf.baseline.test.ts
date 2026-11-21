import {
    buildBaseline,
    compareDurations,
    compareToBaseline,
    deltaPct,
    MIN_COMPARABLE_SAMPLES,
    parseBaselineFile,
} from "@/app/_shared/dev-perf/dev-perf.baseline";
import { ApiCallRecord, DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";

let nextId = 1;
const call = (family: string, totalMs: number): ApiCallRecord => ({
    id: nextId++, at: 0, endpoint: family, family, status: 200, totalMs, sqlMs: 0, sqlCount: 1, cacheHit: false, queries: [], bytes: 0,
});
const snapshot = (calls: ApiCallRecord[]): DevPerfSnapshot => ({ apiCalls: calls, client: [] });

describe("référence et comparaison", () => {
    const before = buildBaseline(
        snapshot([call("groupe-members", 100), call("groupe-members", 300), call("groupe-cohesion", 50), call("groupe-infos", 10)]),
        "avant", "2026-11-21T10:00:00.000Z",
    );

    it("fige la médiane et le p95 de chaque requête", () => {
        expect(before).toMatchObject({ kind: "deputydex-perf-baseline", version: 1, label: "avant", createdAt: "2026-11-21T10:00:00.000Z" });
        expect(before.requests["groupe-members"].server).toEqual({ count: 2, p50Ms: 100, p95Ms: 300 });
    });

    it("compare par requête, régressions d'abord, et garde les requêtes apparues ou disparues", () => {
        const after = buildBaseline(
            snapshot([call("groupe-members", 50), call("groupe-members", 60), call("groupe-cohesion", 80), call("scrutin-votes", 20)]),
            "après", "2026-11-21T11:00:00.000Z",
        );

        const { server } = compareToBaseline(before, after);

        expect(server.map((r) => [r.key, r.p95?.pct == null ? null : Math.round(r.p95.pct)])).toEqual([
            ["groupe-cohesion", 60],    // 50 → 80 : plus lent
            ["groupe-members", -80],    // 300 → 60 : plus rapide
            ["groupe-infos", null],     // disparue
            ["scrutin-votes", null],    // apparue
        ]);
        expect(server.find((r) => r.key === "groupe-infos")).toMatchObject({ before: { p50Ms: 10 }, after: null, p50: null });
    });

    it("classe un écart sur trop peu de mesures après les écarts fiables, même énorme", () => {
        const many = (family: string, ms: number) => Array.from({ length: 5 }, () => call(family, ms));
        const ref = buildBaseline(snapshot([...many("groupe-members", 100), call("groupe-infos", 0.1), call("groupe-infos", 0.1), call("groupe-infos", 0.2)]), "réf", "x");
        const now = buildBaseline(snapshot([...many("groupe-members", 130), call("groupe-infos", 40.8), call("groupe-infos", 0.1), call("groupe-infos", 0.1)]), "act", "x");

        const { server } = compareToBaseline(ref, now);

        expect(server.map((r) => r.key)).toEqual(["groupe-members", "groupe-infos"]);
        expect(server[0]).toMatchObject({ fewSamples: false, p95: { trend: "slower" } });
        expect(server[1]).toMatchObject({ fewSamples: true, p95: { pct: null, trend: "uncertain" } });
        expect(server[1].p95?.ms).toBeCloseTo(40.6);
    });

    it("donne l'écart en % (négatif = plus rapide), null sans référence exploitable", () => {
        expect(deltaPct(200, 100)).toBe(-50);
        expect(deltaPct(100, 130)).toBeCloseTo(30);
        expect(deltaPct(undefined, 100)).toBeNull();
        expect(deltaPct(0, 100)).toBeNull();
    });
});

describe("compareDurations", () => {
    it("en % au-dessus d'1 ms de référence, avec ±10 % de bruit", () => {
        expect(compareDurations(100, 130, false)).toEqual({ ms: 30, pct: 30, trend: "slower" });
        expect(compareDurations(100, 60, false)).toEqual({ ms: -40, pct: -40, trend: "faster" });
        expect(compareDurations(100, 109, false)?.trend).toBe("same");
    });

    it("en ms sous 1 ms de référence (réponse du cache), avec ±5 ms de bruit", () => {
        expect(compareDurations(0.2, 41, false)).toMatchObject({ pct: null, trend: "slower" });
        expect(compareDurations(0.2, 0.4, false)).toMatchObject({ pct: null, trend: "same" });
        expect(compareDurations(0.2, 41, false)?.ms).toBeCloseTo(40.8);
    });

    it("incertain sur trop peu de mesures, quel que soit l'écart", () => {
        expect(compareDurations(100, 300, true)?.trend).toBe("uncertain");
    });

    it("null s'il manque une des deux durées", () => {
        expect(compareDurations(undefined, 10, false)).toBeNull();
        expect(compareDurations(10, undefined, false)).toBeNull();
    });

    it("exige au moins MIN_COMPARABLE_SAMPLES mesures de chaque côté", () => {
        expect(MIN_COMPARABLE_SAMPLES).toBe(5);
    });
});

describe("parseBaselineFile", () => {
    const now = "2026-11-21T12:00:00.000Z";

    it("relit une référence exportée par la page", () => {
        const exported = buildBaseline(snapshot([call("groupe-members", 100)]), "export", now);

        expect(parseBaselineFile(JSON.parse(JSON.stringify(exported)), "fichier.json", now)).toEqual(exported);
    });

    it("construit la référence à partir d'un résultat de perf:bench (mesures brutes)", () => {
        const bench = { label: "bench 3 passages", createdAt: "2026-11-21T09:00:00.000Z", snapshot: snapshot([call("groupe-members", 100)]) };

        expect(parseBaselineFile(bench, "fichier.json", now)).toMatchObject({
            label: "bench 3 passages",
            createdAt: "2026-11-21T09:00:00.000Z",
            requests: { "groupe-members": { server: { count: 1, p50Ms: 100 } } },
        });
    });

    it("accepte aussi un instantané brut de /api/dev/perf, nommé d'après le fichier", () => {
        expect(parseBaselineFile(snapshot([call("groupe-members", 100)]), "mesures.json", now)?.label).toBe("mesures.json");
    });

    it("refuse un contenu qui n'est ni l'un ni l'autre", () => {
        expect(parseBaselineFile({ foo: 1 }, "x.json", now)).toBeNull();
        expect(parseBaselineFile(null, "x.json", now)).toBeNull();
    });
});

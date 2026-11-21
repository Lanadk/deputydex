import {
    cacheSpeedup,
    distributionChartRows,
    domainChartRows,
    durationStats,
    endpointDomain,
    endpointFamily,
    groupSqlQueries,
    liveData,
    percentile,
    percentileProfile,
    summarizeByDomain,
    summarizePages,
} from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { ApiCallRecord, ClientFetchRecord, ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";

let nextId = 1;
function call(family: string, totalMs: number, overrides: Partial<ApiCallRecord> = {}): ApiCallRecord {
    return {
        id: nextId++, at: 0, endpoint: `${family}/RN/17`, family, status: 200,
        totalMs, sqlMs: totalMs / 2, sqlCount: 2, cacheHit: false, queries: [],
        ...overrides,
    };
}

function fetchOf(family: string, durationMs: number, overrides: Partial<ClientFetchRecord> = {}): ClientFetchRecord {
    return {
        kind: "fetch", at: 0, visitId: "v", path: "/p", url: `/api/${family}`, startMs: 0, durationMs, status: 200,
        serverTiming: `total;dur=1.0, db;dur=1.0;desc="1 SQL", cache;desc="miss", endpoint;desc="${family}"`,
        ...overrides,
    };
}

describe("percentile / durationStats", () => {
    it("prend le rang le plus proche, quel que soit l'ordre reçu", () => {
        expect(percentile([30, 10, 20, 40], 50)).toBe(20);
        expect(percentile([30, 10, 20, 40], 95)).toBe(40);
        expect(percentile([], 95)).toBe(0);
    });

    it("résume une série (0 partout si elle est vide)", () => {
        expect(durationStats([10, 30, 20])).toEqual({ count: 3, avgMs: 20, p95Ms: 30, maxMs: 30 });
        expect(durationStats([])).toEqual({ count: 0, avgMs: 0, p95Ms: 0, maxMs: 0 });
    });
});

describe("percentileProfile / distributionChartRows", () => {
    // 1, 2, … 100 ms : chaque percentile tombe sur sa propre valeur.
    const durations = Array.from({ length: 100 }, (_, i) => i + 1);

    it("donne p25, p50, p75, p90 et p95, quel que soit l'ordre reçu", () => {
        expect(percentileProfile([...durations].reverse())).toEqual({
            count: 100,
            values: { 25: 25, 50: 50, 75: 75, 90: 90, 95: 95 },
        });
        expect(percentileProfile([])).toEqual({ count: 0, values: { 25: 0, 50: 0, 75: 0, 90: 0, 95: 0 } });
    });

    it("donne une barre par percentile, une série par durée", () => {
        const rows = distributionChartRows({
            browser: percentileProfile(durations),
            server: percentileProfile(durations.map((d) => d / 2)),
            database: percentileProfile([]),
        });

        expect(rows.map((r) => r.label)).toEqual(["p25", "p50", "p75", "p90", "p95"]);
        expect(rows[1]).toEqual({ label: "p50", navigateur: 50, serveur: 25, base: 0 });
    });
});

describe("endpointFamily / endpointDomain", () => {
    it("nomme la requête par le premier élément des keyParts, sauf la route unique des stats", () => {
        expect(endpointFamily(["groupe-cohesion", "RN", "17"])).toBe("groupe-cohesion");
        expect(endpointFamily(["stat", "acteurs", "parite", "", "{}"])).toBe("stat/acteurs/parite");
        expect(endpointFamily([])).toBe("inconnu");
    });

    it("range chaque requête dans son domaine", () => {
        expect(endpointDomain("groupe-cohesion")).toBe("groupes");
        expect(endpointDomain("groupes-age")).toBe("groupes");
        expect(endpointDomain("depute-identity")).toBe("deputes");
        expect(endpointDomain("scrutin-hemicycle")).toBe("scrutins");
        expect(endpointDomain("stat/acteurs/parite")).toBe("statistics");
        expect(endpointDomain("nouveau-truc")).toBe("autres");
    });
});

describe("summarizeByDomain", () => {
    it("regroupe tous les appels d'une requête : serveur, sans cache (SQL), avec cache, navigateur", () => {
        const [groupes] = summarizeByDomain(
            [
                call("groupe-members", 100, { sqlMs: 80, sqlCount: 2 }),
                call("groupe-members", 300, { sqlMs: 240, sqlCount: 2 }),
                call("groupe-members", 0.4, { cacheHit: true, sqlMs: 0, sqlCount: 0 }),
            ],
            [fetchOf("groupe-members", 150), fetchOf("groupe-members", 350)],
        );

        expect(groupes.domain).toBe("groupes");
        expect(groupes.requests[0]).toMatchObject({
            family: "groupe-members",
            server: { count: 3, maxMs: 300 },
            withoutCache: { count: 2, avgMs: 200, p95Ms: 300, avgSqlMs: 160, avgSqlCount: 2 },
            withCache: { count: 1, avgMs: 0.4 },
            network: { count: 2, avgMs: 250, p95Ms: 350 },
        });
    });

    it("range les domaines par nom et leurs requêtes de la plus lente à la plus rapide", () => {
        const domains = summarizeByDomain([call("scrutin-detail", 5), call("groupe-cohesion", 10), call("groupe-members", 300)], []);

        expect(domains.map((d) => d.domain)).toEqual(["groupes", "scrutins"]);
        expect(domains[0].requests.map((r) => r.family)).toEqual(["groupe-members", "groupe-cohesion"]);
    });
});

describe("cacheSpeedup", () => {
    const [request] = summarizeByDomain([
        call("groupe-members", 52, { sqlMs: 46 }),
        call("groupe-members", 0.4, { cacheHit: true, sqlMs: 0 }),
    ], [])[0].requests;

    it("donne les durées sans et avec cache et le facteur d'accélération (pas un pourcentage négatif)", () => {
        const speedup = cacheSpeedup(request)!;

        expect(speedup.withoutMs).toBe(52);
        expect(speedup.withMs).toBe(0.4);
        expect(speedup.factor).toBeCloseTo(130);
        expect(speedup.savedMs).toBeCloseTo(51.6);
    });

    it("plafonne le facteur quand la réponse du cache mesure 0 ms", () => {
        const [instant] = summarizeByDomain([call("a-b", 10), call("a-b", 0, { cacheHit: true })], [])[0].requests;

        expect(cacheSpeedup(instant)!.factor).toBe(1000);
    });

    it("vaut null tant qu'il manque des appels avec ou sans cache", () => {
        const [missOnly] = summarizeByDomain([call("groupe-members", 52)], [])[0].requests;

        expect(cacheSpeedup(missOnly)).toBeNull();
    });
});

describe("domainChartRows", () => {
    it("donne par domaine la base de données et le reste du serveur (empilés), et le navigateur — sans la série du cache", () => {
        const domains = summarizeByDomain(
            [call("groupe-members", 100, { sqlMs: 80 }), call("groupe-cohesion", 20, { sqlMs: 10 }), call("groupe-cohesion", 1, { cacheHit: true })],
            [fetchOf("groupe-members", 150)],
        );

        expect(domainChartRows(domains)).toEqual([{ label: "groupes", sql: 45, horsSql: 15, reseau: 150 }]);
    });
});

describe("summarizePages", () => {
    const timing = (sqlMs: number, hit: boolean) =>
        `total;dur=1.0, db;dur=${sqlMs.toFixed(1)};desc="1 SQL", cache;desc="${hit ? "hit" : "miss"}", endpoint;desc="groupe-members"`;
    const apiCall = (visitId: string, path: string, at: number, durationMs: number, sqlMs: number, hit: boolean): ClientPerfRecord =>
        fetchOf("groupe-members", durationMs, { visitId, path, at, serverTiming: timing(sqlMs, hit) });

    it("regroupe les visites d'une même page et compare la première à la dernière", () => {
        const pages = summarizePages([
            apiCall("v1", "/groupes/RN", 1000, 400, 300, false),
            apiCall("v1", "/groupes/RN", 1010, 200, 150, false),
            apiCall("v2", "/deputydex", 2000, 50, 20, false),
            apiCall("v3", "/groupes/RN", 3000, 30, 0, true),
            apiCall("v3", "/groupes/RN", 3005, 20, 0, true),
        ]);

        expect(pages.map((p) => p.path)).toEqual(["/groupes/RN", "/deputydex"]);
        expect(pages[0]).toMatchObject({
            visits: 2,
            duration: { count: 2, avgMs: 215, maxMs: 400 },
            first: { durationMs: 400, apiCalls: 2, cachedCalls: 0, sqlMs: 450 },
            last: { durationMs: 30, apiCalls: 2, cachedCalls: 2, sqlMs: 0 },
        });
        expect(pages[0].lastVisit.visitId).toBe("v3");
    });
});

describe("groupSqlQueries", () => {
    it("regroupe les exécutions d'une même requête SQL et trie par temps cumulé", () => {
        const queries = groupSqlQueries([
            call("groupe-members", 0, { queries: [{ text: "SELECT a", durationMs: 10, offsetMs: 0 }, { text: "SELECT b", durationMs: 50, offsetMs: 0 }] }),
            call("groupe-cohesion", 0, { queries: [{ text: "SELECT a", durationMs: 30, offsetMs: 0 }] }),
            call("groupe-members", 0, { queries: [{ text: "SELECT a", durationMs: 20, offsetMs: 0 }] }),
        ]);

        expect(queries.map((q) => q.text)).toEqual(["SELECT a", "SELECT b"]);
        expect(queries[0]).toMatchObject({
            count: 3, totalMs: 60, avgMs: 20, maxMs: 30, families: ["groupe-members", "groupe-cohesion"],
        });
    });
});

describe("liveData", () => {
    // Horodatages construits en heure locale : les libellés « hh:mm:ss » le sont aussi.
    const at = (h: number, m: number, s: number) => new Date(2026, 10, 21, h, m, s).getTime();
    const now = at(11, 40, 0);
    const timing = (totalMs: number, sqlMs: number, hit: boolean, family: string) =>
        `total;dur=${totalMs.toFixed(1)}, db;dur=${sqlMs.toFixed(1)};desc="1 SQL", cache;desc="${hit ? "hit" : "miss"}", endpoint;desc="${family}"`;
    const apiFetch = (family: string, when: number, navMs: number, serverMs: number, sqlMs: number, hit = false) =>
        fetchOf(family, navMs, { at: when, serverTiming: timing(serverMs, sqlMs, hit, family) });

    const client: ClientPerfRecord[] = [
        apiFetch("groupe-members", at(11, 30, 0), 999, 900, 800),            // hors fenêtre de 5 min
        apiFetch("groupe-members", at(11, 39, 10), 80, 60, 50),
        apiFetch("groupe-cohesion", at(11, 39, 20), 70, 40, 30),
        apiFetch("groupe-members", at(11, 39, 30), 20, 0.5, 0, true),       // servi par le cache
    ];

    it("donne, pour chaque appel de la fenêtre, ses trois durées mesurées sur le même appel", () => {
        const live = liveData(client, { now, windowMs: 300_000, family: null });

        expect(live.rows).toEqual([
            { label: "11:39:10 · members", navigateur: 80, serveur: 60, base: 50, tendance: 80 },
            { label: "11:39:20 · cohesion", navigateur: 70, serveur: 40, base: 30, tendance: 75 },
            { label: "11:39:30 · members", navigateur: 20, serveur: 0.5, base: null, tendance: 56.7 },
        ]);
    });

    it("résume la fenêtre : base de données sur les seuls appels exécutés, part du cache", () => {
        const { stats } = liveData(client, { now, windowMs: 300_000, family: null });

        expect(stats).toMatchObject({
            calls: 3,
            browser: { count: 3, maxMs: 80 },
            database: { count: 2, avgMs: 40 },
            cacheRate: 1 / 3,
        });
    });

    it("donne la distribution des trois durées sur les mêmes appels (base hors cache)", () => {
        const { distribution } = liveData(client, { now, windowMs: 300_000, family: null });

        expect(distribution.browser).toEqual({ count: 3, values: { 25: 20, 50: 70, 75: 80, 90: 80, 95: 80 } });
        expect(distribution.database.count).toBe(2);
        expect(distribution.database.values[50]).toBe(30);
    });

    it("suit une seule requête quand on la choisit, sur toutes les mesures", () => {
        const live = liveData(client, { now, windowMs: null, family: "groupe-members" });

        expect(live.rows.map((r) => r.navigateur)).toEqual([999, 80, 20]);
    });

    it("ne garde que les derniers appels pour rester lisible", () => {
        const live = liveData(client, { now, windowMs: null, family: null }, 2);

        expect(live.rows.map((r) => r.label)).toEqual(["11:39:20 · cohesion", "11:39:30 · members"]);
        expect(live.stats.calls).toBe(4);
    });
});

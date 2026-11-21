import {
    domainChartRows,
    endpointDomain,
    endpointFamily,
    groupPageVisits,
    percentile,
    requestChartRows,
    shortRequestLabel,
    slowestQueries,
    summarizeByDomain,
} from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { ApiCallRecord, ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";

function call(family: string, totalMs: number, overrides: Partial<ApiCallRecord> = {}): ApiCallRecord {
    return {
        id: 1, at: 0, endpoint: `${family}/RN/17`, family, status: 200,
        totalMs, sqlMs: totalMs / 2, sqlCount: 2, cacheHit: false, queries: [],
        ...overrides,
    };
}

describe("percentile", () => {
    it("prend le rang le plus proche, quel que soit l'ordre reçu", () => {
        expect(percentile([30, 10, 20, 40], 50)).toBe(20);
        expect(percentile([30, 10, 20, 40], 95)).toBe(40);
        expect(percentile([7], 95)).toBe(7);
    });

    it("vaut 0 pour une liste vide", () => {
        expect(percentile([], 95)).toBe(0);
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
        expect(endpointDomain("legislature-current")).toBe("legislatures");
        expect(endpointDomain("stat/acteurs/parite")).toBe("statistics");
        expect(endpointDomain("nouveau-truc")).toBe("autres");
    });
});

describe("summarizeByDomain", () => {
    const fetchOf = (family: string, durationMs: number): ClientPerfRecord => ({
        kind: "fetch", visitId: "v", path: "/p", url: `/api/${family}`, startMs: 0, durationMs, status: 200,
        serverTiming: `total;dur=1.0, db;dur=1.0;desc="1 SQL", cache;desc="miss", endpoint;desc="${family}"`,
    });

    it("sépare sans cache / avec cache côté serveur, et ajoute la durée réseau du navigateur", () => {
        const [groupes] = summarizeByDomain(
            [
                call("groupe-members", 100, { sqlMs: 80, sqlCount: 2 }),
                call("groupe-members", 300, { sqlMs: 240, sqlCount: 2 }),
                call("groupe-members", 4, { cacheHit: true, sqlMs: 0, sqlCount: 0 }),
            ],
            [fetchOf("groupe-members", 150), fetchOf("groupe-members", 350)],
        );

        expect(groupes.domain).toBe("groupes");
        expect(groupes.requests[0]).toMatchObject({
            family: "groupe-members",
            calls: 3,
            withoutCache: { count: 2, avgMs: 200, p95Ms: 300, avgSqlMs: 160, avgSqlCount: 2 },
            withCache: { count: 1, avgMs: 4, p95Ms: 4 },
            network: { count: 2, avgMs: 250, p95Ms: 350 },
        });
    });

    it("range les domaines par nom et leurs requêtes de la plus lente à la plus rapide", () => {
        const domains = summarizeByDomain(
            [call("scrutin-detail", 5), call("groupe-cohesion", 10), call("groupe-members", 300)],
            [],
        );

        expect(domains.map((d) => d.domain)).toEqual(["groupes", "scrutins"]);
        expect(domains[0].requests.map((r) => r.family)).toEqual(["groupe-members", "groupe-cohesion"]);
        expect(domains[0].requests[0].network.count).toBe(0);
    });
});

describe("slowestQueries", () => {
    it("garde les requêtes les plus lentes toutes routes confondues, avec leur endpoint", () => {
        const top = slowestQueries([
            call("a", 0, { endpoint: "a/1", queries: [{ text: "SELECT 1", durationMs: 5, offsetMs: 0 }, { text: "SELECT 2", durationMs: 50, offsetMs: 0 }] }),
            call("b", 0, { endpoint: "b/1", queries: [{ text: "SELECT 3", durationMs: 20, offsetMs: 0 }] }),
        ], 2);

        expect(top.map((q) => [q.text, q.endpoint])).toEqual([["SELECT 2", "a/1"], ["SELECT 3", "b/1"]]);
    });
});

describe("totaux par domaine et données des graphiques", () => {
    // groupe-members : 2 appels sans cache (100 et 300 ms, SQL 80 et 240), 1 avec cache (4 ms)
    // groupe-cohesion : 2 appels sans cache (10 et 30 ms, SQL 5 et 15)
    const domains = summarizeByDomain([
        call("groupe-members", 100, { sqlMs: 80 }),
        call("groupe-members", 300, { sqlMs: 240 }),
        call("groupe-members", 4, { cacheHit: true, sqlMs: 0, sqlCount: 0 }),
        call("groupe-cohesion", 10, { sqlMs: 5 }),
        call("groupe-cohesion", 30, { sqlMs: 15 }),
    ], []);

    it("calcule les moyennes du domaine pondérées par le nombre d'appels", () => {
        expect(domains[0]).toMatchObject({
            domain: "groupes",
            withoutCache: { count: 4, avgMs: 110, avgSqlMs: 85 },
            withCache: { count: 1, avgMs: 4 },
            network: { count: 0, avgMs: 0 },
        });
    });

    it("donne une barre par requête : SQL + hors SQL empilés = serveur sans cache", () => {
        expect(requestChartRows(domains[0].requests)).toEqual([
            { label: "members", sql: 160, horsSql: 40, cache: 4, reseau: 0 },
            { label: "cohesion", sql: 10, horsSql: 10, cache: 0, reseau: 0 },
        ]);
    });

    it("donne une barre par domaine pour la vue d'ensemble", () => {
        expect(domainChartRows(domains)).toEqual([{ label: "groupes", sql: 85, horsSql: 25, cache: 4, reseau: 0 }]);
    });

    it("raccourcit le nom d'une requête dans le graphique de son domaine", () => {
        expect(shortRequestLabel("groupe-cohesion")).toBe("cohesion");
        expect(shortRequestLabel("depute-amendement-stats")).toBe("amendement-stats");
        expect(shortRequestLabel("stat/acteurs/parite")).toBe("acteurs/parite");
        expect(shortRequestLabel("datasets")).toBe("datasets");
    });
});

describe("groupPageVisits", () => {
    const section = (visitId: string, sectionId: string, startMs: number, durationMs: number): ClientPerfRecord =>
        ({ kind: "section", visitId, path: `/p/${visitId}`, sectionId, startMs, durationMs, ok: true });
    const fetchRec = (visitId: string, startMs: number, durationMs: number): ClientPerfRecord =>
        ({ kind: "fetch", visitId, path: `/p/${visitId}`, url: "/api/x", startMs, durationMs, status: 200, serverTiming: null });

    it("regroupe par visite, la plus récente d'abord, sections triées par début", () => {
        const visits = groupPageVisits([
            section("v1", "activite", 100, 50),
            fetchRec("v1", 90, 40),
            section("v2", "membres", 300, 100),
            section("v2", "kpi", 120, 30),
        ]);

        expect(visits.map((v) => v.visitId)).toEqual(["v2", "v1"]);
        expect(visits[0].sections.map((s) => s.sectionId)).toEqual(["kpi", "membres"]);
        expect(visits[0].durationMs).toBe(400);
        expect(visits[1]).toMatchObject({ path: "/p/v1", durationMs: 150 });
        expect(visits[1].fetches).toHaveLength(1);
    });

    it("limite le nombre de visites rendues", () => {
        const records = ["a", "b", "c"].map((id) => section(id, "s", 0, 1));

        expect(groupPageVisits(records, 2).map((v) => v.visitId)).toEqual(["c", "b"]);
    });
});

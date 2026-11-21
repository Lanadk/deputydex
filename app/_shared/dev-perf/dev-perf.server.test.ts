/**
 * @jest-environment node
 */
import {
    attachRequestPerf,
    currentRequestPerf,
    describePrismaQuery,
    devPerfPrismaExtension,
    finishRequestPerf,
    runWithRequestPerf,
    sqlWallTimeMs,
    startRequestPerf,
} from "@/app/_shared/dev-perf/dev-perf.server";
import { clearDevPerf, getDevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.store";

const runQuery = (args: unknown, model?: string, operation = "$queryRaw") =>
    devPerfPrismaExtension.query.$allOperations({ model, operation, args, query: async () => "rows" });

describe("describePrismaQuery", () => {
    it("reconstitue le SQL d'un $queryRaw avec des paramètres numérotés, sur une ligne", () => {
        const text = describePrismaQuery(undefined, "$queryRaw", {
            strings: ["SELECT *\n    FROM groupes\n    WHERE code = ", " AND legislature = ", ""],
        });

        expect(text).toBe("SELECT * FROM groupes WHERE code = $1 AND legislature = $2");
    });

    it("décrit une requête Prisma non brute par modèle et opération", () => {
        expect(describePrismaQuery("Acteurs", "findMany", { where: {} })).toBe("Acteurs.findMany");
    });

    it("tronque une requête très longue", () => {
        const text = describePrismaQuery(undefined, "$queryRaw", { strings: ["SELECT " + "x, ".repeat(400)] });

        expect(text.length).toBeLessThanOrEqual(601);
        expect(text.endsWith("…")).toBe(true);
    });
});

describe("sqlWallTimeMs", () => {
    it("compte une seule fois les requêtes lancées en parallèle (Promise.all)", () => {
        // 3 requêtes de 0 à ~103 ms en parallèle, puis une de 150 à 170 ms.
        const queries = [
            { offsetMs: 0, durationMs: 100 },
            { offsetMs: 2, durationMs: 90 },
            { offsetMs: 5, durationMs: 98 },
            { offsetMs: 150, durationMs: 20 },
        ];

        expect(sqlWallTimeMs(queries)).toBe(123);
    });

    it("additionne des requêtes successives, et vaut 0 sans requête", () => {
        expect(sqlWallTimeMs([{ offsetMs: 0, durationMs: 10 }, { offsetMs: 10, durationMs: 5 }])).toBe(15);
        expect(sqlWallTimeMs([])).toBe(0);
    });
});

describe("mesure d'un appel d'API", () => {
    beforeEach(() => clearDevPerf());

    it("rattache les requêtes SQL à l'appel en cours, et seulement à lui", async () => {
        const perf = startRequestPerf(["groupe-cohesion", "RN", "17"]);

        await runWithRequestPerf(perf, async () => {
            await runQuery({ strings: ["SELECT 1"] });
            await runQuery({ strings: ["SELECT 2"] });
        });
        await runQuery({ strings: ["SELECT hors appel"] });

        expect(perf.queries.map((q) => q.text)).toEqual(["SELECT 1", "SELECT 2"]);
        expect(perf.queries.every((q) => q.offsetMs >= 0)).toBe(true);
        expect(currentRequestPerf()).toBeUndefined();
    });

    it("ajoute l'en-tête Server-Timing et enregistre l'appel à la fin", () => {
        const perf = startRequestPerf(["groupe-cohesion", "RN", "17"]);
        perf.executed = true;
        perf.queries.push({ text: "SELECT 1", durationMs: 12, offsetMs: 0 }, { text: "SELECT 2", durationMs: 8, offsetMs: 12 });
        const result = { success: true };
        attachRequestPerf(result, perf);
        const response = new Response("{}", { status: 200 });

        finishRequestPerf(result, response);

        expect(response.headers.get("Server-Timing")).toMatch(/db;dur=20\.0;desc="2 SQL", cache;desc="miss", endpoint;desc="groupe-cohesion"/);
        const [recorded] = getDevPerfSnapshot().apiCalls;
        expect(recorded).toMatchObject({
            endpoint: "groupe-cohesion/RN/17", family: "groupe-cohesion", status: 200, sqlMs: 20, sqlCount: 2, cacheHit: false,
        });
    });

    it("compte comme réponse du cache un appel dont le use-case n'a pas été exécuté", () => {
        const perf = startRequestPerf(["groupe-members", "RN", "17"]);
        const result = { success: true };
        attachRequestPerf(result, perf);

        finishRequestPerf(result, new Response("{}"));

        expect(getDevPerfSnapshot().apiCalls[0]).toMatchObject({ cacheHit: true, sqlCount: 0 });
    });

    it("ne fait rien pour une réponse sans mesure (paramètre rejeté avant le use-case)", () => {
        const response = new Response("{}", { status: 400 });

        finishRequestPerf({ success: false }, response);

        expect(response.headers.get("Server-Timing")).toBeNull();
        expect(getDevPerfSnapshot().apiCalls).toHaveLength(0);
    });
});

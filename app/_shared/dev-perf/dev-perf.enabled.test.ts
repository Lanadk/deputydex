/**
 * @jest-environment node
 */
jest.mock("@/app/_shared/dev-perf/dev-perf.config", () => ({ DEV_PERF_ENABLED: true }));

import { cachedResult } from "@/app/_shared/cache/cached-response";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { err, ok } from "@/app/_shared/result-pattern/result";
import { currentRequestPerf } from "@/app/_shared/dev-perf/dev-perf.server";
import { clearDevPerf, getDevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.store";
import { GET, POST } from "@/app/api/dev/perf/route";

/** Use-case simulé qui « exécute » des requêtes SQL successives dans le contexte de mesure. */
async function useCaseWithSql(durations: number[]) {
    let offsetMs = 0;
    for (const durationMs of durations) {
        currentRequestPerf()?.queries.push({ text: "SELECT 1", durationMs, offsetMs });
        offsetMs += durationMs;
    }
    return ok({ value: 1 });
}

describe("outil de perf activé (NEXT_PUBLIC_DEV_PERF=true)", () => {
    beforeEach(() => clearDevPerf());

    it("mesure un appel de bout en bout : en-tête Server-Timing et enregistrement", async () => {
        const result = await cachedResult(() => useCaseWithSql([4, 6]), ["groupe-cohesion", "RN", "17"]);
        const response = resultToResponse(result);

        expect(response.status).toBe(200);
        expect(response.headers.get("Server-Timing")).toMatch(/db;dur=10\.0;desc="2 SQL", cache;desc="miss"/);
        expect(getDevPerfSnapshot().apiCalls).toEqual([
            expect.objectContaining({ endpoint: "groupe-cohesion/RN/17", family: "groupe-cohesion", sqlCount: 2, cacheHit: false }),
        ]);
    });

    it("mesure aussi une erreur du use-case, avec son statut", async () => {
        const result = await cachedResult(async () => err("NOT_FOUND" as const), ["groupe-infos", "XX", "17"]);
        const response = resultToResponse(result);

        expect(response.status).toBe(404);
        expect(getDevPerfSnapshot().apiCalls[0]).toMatchObject({ family: "groupe-infos", status: 404 });
    });

    it("expose les mesures et accepte celles du navigateur via /api/dev/perf", async () => {
        const record = { kind: "section", visitId: "v1", path: "/groupes/RN", sectionId: "kpi", startMs: 5, durationMs: 40, ok: true };
        const post = await POST(new Request("http://localhost/api/dev/perf", {
            method: "POST",
            body: JSON.stringify([record, { kind: "inconnu" }]),
        }));

        expect(post.status).toBe(204);
        const snapshot = await (await GET()).json();
        expect(snapshot.client).toEqual([record]);
    });
});

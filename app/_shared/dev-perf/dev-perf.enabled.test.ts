/**
 * @jest-environment node
 */
jest.mock("@/app/_shared/dev-perf/dev-perf.config", () => ({ DEV_PERF_ENABLED: true, DEV_PERF_MAX_RECORDS: 2000 }));

import { cachedResult } from "@/app/_shared/cache/cached-response";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { err, ok } from "@/app/_shared/result-pattern/result";
import { currentRequestPerf } from "@/app/_shared/dev-perf/dev-perf.server";
import { clearDevPerf, getDevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.store";
import { DELETE, GET, POST } from "@/app/api/dev/perf/route";
import { DELETE as clearServerCache } from "@/app/api/dev/perf/cache/route";
import { revalidateTag } from "next/cache";

/** Use-case simulé qui « exécute » des requêtes SQL successives dans le contexte de mesure. */
async function useCaseWithSql(durations: number[]) {
    let offsetMs = 0;
    for (const durationMs of durations) {
        currentRequestPerf()?.queries.push({ text: "SELECT 1", durationMs, offsetMs });
        offsetMs += durationMs;
    }
    return ok({ value: 1 });
}

/** Requête faite depuis la machine elle-même (seules acceptées par l'API de perf). */
const localRequest = (path: string, init: RequestInit = {}) =>
    new Request(`http://localhost:3000${path}`, { ...init, headers: { host: "localhost:3000" } });

describe("outil de perf activé (NEXT_PUBLIC_DEV_PERF=true)", () => {
    beforeEach(() => {
        clearDevPerf();
        jest.clearAllMocks();
    });

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

    it("mesure le poids du corps JSON de la réponse", async () => {
        resultToResponse(await cachedResult(async () => ok({ nom: "Élodie" }), ["depute-identity", "PA1", "17"]));

        // {"nom":"Élodie"} : 16 caractères, dont « É » sur 2 octets en UTF-8.
        expect(getDevPerfSnapshot().apiCalls[0].bytes).toBe(17);
    });

    it("vide le cache serveur tout de suite (expire: 0), pour mesurer une page à froid", async () => {
        const response = await clearServerCache(localRequest("/api/dev/perf/cache", { method: "DELETE" }));

        expect(response.status).toBe(204);
        expect(revalidateTag).toHaveBeenCalledWith("parliament-data", { expire: 0 });
    });

    it("expose les mesures et accepte celles du navigateur (dont les Web Vitals) via /api/dev/perf", async () => {
        const section = { kind: "section", at: 1_000, visitId: "v1", path: "/groupes/RN", sectionId: "kpi", startMs: 5, durationMs: 40, ok: true };
        const vital = { kind: "vital", at: 1_200, visitId: "v1", path: "/groupes/RN", name: "LCP", value: 820 };
        const post = await POST(localRequest("/api/dev/perf", {
            method: "POST",
            body: JSON.stringify([section, vital, { kind: "inconnu" }, { ...vital, name: "XYZ" }]),
        }));

        expect(post.status).toBe(204);
        const snapshot = await (await GET(localRequest("/api/dev/perf"))).json();
        expect(snapshot.client).toEqual([section, vital]);
    });

    it("répond 404 à une requête qui ne vient pas de la machine, même outil activé", async () => {
        const fromOutside = (method = "GET") => new Request("https://deputedex.fr/api/dev/perf", {
            method,
            headers: { host: "localhost", "x-forwarded-for": "203.0.113.7" },
        });

        expect((await GET(fromOutside())).status).toBe(404);
        expect((await DELETE(fromOutside("DELETE"))).status).toBe(404);
        expect((await clearServerCache(fromOutside("DELETE"))).status).toBe(404);
        expect(revalidateTag).not.toHaveBeenCalled();
    });
});

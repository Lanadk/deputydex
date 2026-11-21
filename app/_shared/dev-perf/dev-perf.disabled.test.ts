/**
 * @jest-environment node
 */
jest.mock("@/app/_shared/dev-perf/dev-perf.config", () => ({ DEV_PERF_ENABLED: false }));

import { cachedResult } from "@/app/_shared/cache/cached-response";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { ok } from "@/app/_shared/result-pattern/result";
import { clearDevPerf, getDevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.store";
import { DELETE, GET, POST } from "@/app/api/dev/perf/route";

describe("outil de perf désactivé (production)", () => {
    beforeEach(() => clearDevPerf());

    it("ne mesure rien et n'ajoute pas d'en-tête Server-Timing", async () => {
        const response = resultToResponse(await cachedResult(async () => ok({ value: 1 }), ["groupe-cohesion", "RN", "17"]));

        expect(response.status).toBe(200);
        expect(response.headers.get("Server-Timing")).toBeNull();
        expect(getDevPerfSnapshot().apiCalls).toHaveLength(0);
    });

    it("répond 404 sur toute l'API /api/dev/perf", async () => {
        const post = await POST(new Request("http://localhost/api/dev/perf", { method: "POST", body: "[]" }));

        expect((await GET()).status).toBe(404);
        expect(post.status).toBe(404);
        expect((await DELETE()).status).toBe(404);
    });
});

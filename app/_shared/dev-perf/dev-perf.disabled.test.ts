/**
 * @jest-environment node
 */
jest.mock("@/app/_shared/dev-perf/dev-perf.config", () => ({ DEV_PERF_ENABLED: false, DEV_PERF_MAX_RECORDS: 2000 }));

import { cachedResult } from "@/app/_shared/cache/cached-response";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { ok } from "@/app/_shared/result-pattern/result";
import { clearDevPerf, getDevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.store";
import { DELETE, GET, POST } from "@/app/api/dev/perf/route";
import { DELETE as clearServerCache } from "@/app/api/dev/perf/cache/route";
import { revalidateTag } from "next/cache";

describe("outil de perf désactivé (production)", () => {
    beforeEach(() => clearDevPerf());

    it("ne mesure rien et n'ajoute pas d'en-tête Server-Timing", async () => {
        const response = resultToResponse(await cachedResult(async () => ok({ value: 1 }), ["groupe-cohesion", "RN", "17"]));

        expect(response.status).toBe(200);
        expect(response.headers.get("Server-Timing")).toBeNull();
        expect(getDevPerfSnapshot().apiCalls).toHaveLength(0);
    });

    it("répond 404 sur toute l'API /api/dev/perf, même en local, et ne touche pas au cache", async () => {
        const local = (method = "GET", body?: string) =>
            new Request("http://localhost:3000/api/dev/perf", { method, body, headers: { host: "localhost:3000" } });

        expect((await GET(local())).status).toBe(404);
        expect((await POST(local("POST", "[]"))).status).toBe(404);
        expect((await DELETE(local("DELETE"))).status).toBe(404);
        expect((await clearServerCache(local("DELETE"))).status).toBe(404);
        expect(revalidateTag).not.toHaveBeenCalled();
    });
});

/**
 * @jest-environment node
 */
jest.mock("@/app/_shared/dev-perf/dev-perf.config", () => ({ DEV_PERF_ENABLED: true, DEV_PERF_MAX_RECORDS: 3 }));

import { clearDevPerf, getDevPerfSnapshot, recordClientPerf } from "@/app/_shared/dev-perf/dev-perf.store";
import { ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";

const section = (n: number): ClientPerfRecord =>
    ({ kind: "section", at: n, visitId: "v", path: "/p", sectionId: `s${n}`, startMs: 0, durationMs: 1, ok: true });

describe("stockage en mémoire des mesures", () => {
    beforeEach(() => clearDevPerf());

    it("garde les plus récentes au-delà du plafond, et oublie les plus anciennes", () => {
        recordClientPerf([1, 2, 3, 4, 5].map(section));

        expect(getDevPerfSnapshot().client.map((r) => r.at)).toEqual([3, 4, 5]);
    });
});

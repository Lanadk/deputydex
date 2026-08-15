/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository", () => ({
    prismaActeursStatsRepository: { getAgeDistribution: jest.fn() },
}));

import { GET } from "@/app/api/statistics/[domain]/[statId]/route";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";

const getAgeDistribution = prismaActeursStatsRepository.getAgeDistribution as jest.Mock;

function call(domain: string, statId: string, search = "") {
    return GET(new Request(`http://localhost${search}`), { params: Promise.resolve({ domain, statId }) });
}

describe("GET /api/statistics/[domain]/[statId]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the RawStatData for a known stat", async () => {
        getAgeDistribution.mockResolvedValue([{ tranche_age: "<30", nb_acteurs: 12 }]);

        const res = await call("acteurs", "age-distribution");

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            shape: "distribution",
            items: [{ label: "<30", value: 12 }],
        });
    });

    it("returns 404 for an unknown domain", async () => {
        const res = await call("unknown-domain", "age-distribution");

        expect(res.status).toBe(404);
    });

    it("returns 404 for an unknown statId within a known domain", async () => {
        const res = await call("acteurs", "unknown-stat");

        expect(res.status).toBe(404);
    });

    it("returns 500 when the repository throws", async () => {
        getAgeDistribution.mockRejectedValue(new Error("DB down"));

        const res = await call("acteurs", "age-distribution");

        expect(res.status).toBe(500);
    });
});

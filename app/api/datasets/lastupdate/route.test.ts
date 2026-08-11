/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/datasets/repositories/prisma-datasets-repository", () => ({
    prismaDataSetsRepository: { getLastUpdate: jest.fn() },
}));

import { GET } from "@/app/api/datasets/lastupdate/route";
import { prismaDataSetsRepository } from "@/app/infrastructure/datasets/repositories/prisma-datasets-repository";

const getLastUpdate = prismaDataSetsRepository.getLastUpdate as jest.Mock;

describe("GET /api/datasets/lastupdate", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the last update date", async () => {
        getLastUpdate.mockResolvedValue(new Date("2026-08-10T03:00:00Z"));

        const res = await GET();

        expect(res.status).toBe(200);
        expect(await res.json()).toBe("2026-08-10T03:00:00.000Z");
    });

    it("returns 500 when the repository resolves null", async () => {
        getLastUpdate.mockResolvedValue(null);

        const res = await GET();

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getLastUpdate.mockRejectedValue(new Error("DB down"));

        const res = await GET();

        expect(res.status).toBe(500);
    });
});

/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository", () => ({
    prismaLegislaturesRepository: { getCurrent: jest.fn(), getAll: jest.fn() },
}));

import { GET } from "@/app/api/legislatures/route";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";

const getAll = prismaLegislaturesRepository.getAll as jest.Mock;

describe("GET /api/legislatures", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the mapped list", async () => {
        getAll.mockResolvedValue([{ id: 1, number: 16, startDate: null, endDate: null }]);

        const res = await GET();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([{ id: 1, number: 16, startDate: null, endDate: null }]);
    });

    it("returns 200 with an empty list when there are no legislatures", async () => {
        getAll.mockResolvedValue([]);

        const res = await GET();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([]);
    });

    it("returns 500 when the repository throws", async () => {
        getAll.mockRejectedValue(new Error("DB down"));

        const res = await GET();

        expect(res.status).toBe(500);
    });
});

/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository", () => ({
    prismaLegislaturesRepository: { getCurrent: jest.fn(), getAll: jest.fn() },
}));

import { GET } from "@/app/api/legislatures/current/route";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";

const getCurrent = prismaLegislaturesRepository.getCurrent as jest.Mock;

describe("GET /api/legislatures/current", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the current legislature DTO", async () => {
        getCurrent.mockResolvedValue({ id: 2, number: 17, startDate: new Date("2024-07-08"), endDate: null });

        const res = await GET();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(expect.objectContaining({ number: 17 }));
    });

    it("returns 404 when there is no current legislature", async () => {
        getCurrent.mockResolvedValue(null);

        const res = await GET();

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: "NOT_FOUND" });
    });

    it("returns 500 when the repository throws", async () => {
        getCurrent.mockRejectedValue(new Error("DB down"));

        const res = await GET();

        expect(res.status).toBe(500);
    });
});

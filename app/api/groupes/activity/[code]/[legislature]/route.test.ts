/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-activity.repository", () => ({
    prismaGroupeActivityRepository: { getGroupeActivity: jest.fn() },
}));

import { GET } from "@/app/api/groupes/activity/[code]/[legislature]/route";
import { prismaGroupeActivityRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-activity.repository";

const getGroupeActivity = prismaGroupeActivityRepository.getGroupeActivity as jest.Mock;

function call(code: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code, legislature }) });
}

describe("GET /api/groupes/activity/[code]/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the mapped activity calendar", async () => {
        getGroupeActivity.mockResolvedValue([{ activity_date: new Date("2024-07-08"), total_count: 5 }]);

        const res = await call("REN", "17");

        expect(getGroupeActivity).toHaveBeenCalledWith("REN", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([{ date: "2024-07-08", count: 5, level: 1 }]);
    });

    it("returns 500 when the repository resolves null", async () => {
        getGroupeActivity.mockResolvedValue(null);

        const res = await call("UNKNOWN", "17");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeActivity.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

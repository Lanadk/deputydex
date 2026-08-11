/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-activity-details.repository", () => ({
    prismaGroupeActivityDetailsRepository: { getGroupeActivityDetails: jest.fn() },
}));

import { GET } from "@/app/api/groupes/activity/[code]/[legislature]/details/route";
import { prismaGroupeActivityDetailsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-activity-details.repository";

const getGroupeActivityDetails = prismaGroupeActivityDetailsRepository.getGroupeActivityDetails as jest.Mock;

function call(code: string, legislature: string, date?: string) {
    const url = date
        ? `http://localhost/api/groupes/activity/${code}/${legislature}/details?date=${date}`
        : `http://localhost/api/groupes/activity/${code}/${legislature}/details`;
    return GET(new Request(url), { params: Promise.resolve({ code, legislature }) });
}

describe("GET /api/groupes/activity/[code]/[legislature]/details", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 400 when the 'date' query param is missing", async () => {
        const res = await call("REN", "17");

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Missing date" });
        expect(getGroupeActivityDetails).not.toHaveBeenCalled();
    });

    it("returns 200 with the mapped details, forwarding a parsed Date to the repository", async () => {
        getGroupeActivityDetails.mockResolvedValue([
            { activity_date: new Date("2024-07-08"), domain: "vote", ref_id: "VTANR5L17V1", meta: { type: "vote" } },
        ]);

        const res = await call("REN", "17", "2024-07-08");

        expect(getGroupeActivityDetails).toHaveBeenCalledWith("REN", 17, new Date("2024-07-08"));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([
            { date: "2024-07-08", domain: "vote", refId: "VTANR5L17V1", meta: { type: "vote" } },
        ]);
    });

    it("returns 500 when the repository resolves null", async () => {
        getGroupeActivityDetails.mockResolvedValue(null);

        const res = await call("UNKNOWN", "17", "2024-07-08");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeActivityDetails.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17", "2024-07-08");

        expect(res.status).toBe(500);
    });
});

/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository", () => ({
    prismaGroupeCohesionRepository: { getGroupeCohesionLegislature: jest.fn() },
}));

import { GET } from "@/app/api/groupes/cohesion/[code]/[legislature]/route";
import { prismaGroupeCohesionRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

const getGroupeCohesionLegislature = prismaGroupeCohesionRepository.getGroupeCohesionLegislature as jest.Mock;

function call(code: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code, legislature }) });
}

describe("GET /api/groupes/cohesion/[code]/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the cohesion history DTO", async () => {
        getGroupeCohesionLegislature.mockResolvedValue({
            evolutionCohesionLegislature: [{ mois: new Date("2024-07-01"), taux_cohesion: 0.92 }],
        });

        const res = await call("REN", "17");

        expect(getGroupeCohesionLegislature).toHaveBeenCalledWith("REN", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            evolutionCohesionLegislature: [{ key: "2024-07", value: 0.92 }],
        });
    });

    it("returns 500 when the repository resolves a falsy value", async () => {
        getGroupeCohesionLegislature.mockResolvedValue(null);

        const res = await call("UNKNOWN", "17");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeCohesionLegislature.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

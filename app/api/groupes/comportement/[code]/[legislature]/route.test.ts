/**
 * @jest-environment node
 */

// prisma-groupe-comportement.repository exporte son repository en `export default`
// (contrairement aux autres repositories groupes, qui utilisent un named export).
jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-comportement.repository", () => ({
    __esModule: true,
    default: { getGroupeComportementLegislature: jest.fn() },
}));

import { GET } from "@/app/api/groupes/comportement/[code]/[legislature]/route";
import prismaGroupeComportementRepository from "@/app/infrastructure/groupes/repositories/prisma-groupe-comportement.repository";

const getGroupeComportementLegislature =
    prismaGroupeComportementRepository.getGroupeComportementLegislature as jest.Mock;

function call(code: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code, legislature }) });
}

describe("GET /api/groupes/comportement/[code]/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the participation history DTO", async () => {
        getGroupeComportementLegislature.mockResolvedValue({
            participationLegislature: [{ mois: new Date("2024-07-01"), taux_participation_moyen_deputes: 0.75 }],
        });

        const res = await call("REN", "17");

        expect(getGroupeComportementLegislature).toHaveBeenCalledWith("REN", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            evolutionParticipationLegislature: [{ key: "2024-07", value: 0.75 }],
        });
    });

    it("returns 500 when the repository resolves a falsy value", async () => {
        getGroupeComportementLegislature.mockResolvedValue(null);

        const res = await call("UNKNOWN", "17");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeComportementLegislature.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

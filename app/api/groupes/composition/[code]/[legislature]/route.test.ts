/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-composition.repository", () => ({
    prismaGroupeCompositionRepository: { getGroupeComposition: jest.fn() },
}));

import { GET } from "@/app/api/groupes/composition/[code]/[legislature]/route";
import { prismaGroupeCompositionRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-composition.repository";

const getGroupeComposition = prismaGroupeCompositionRepository.getGroupeComposition as jest.Mock;

function call(code: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code, legislature }) });
}

const ENTITY = {
    groupeCountMembers: 88,
    averageAge: 47.5,
    averageCumulatedYears: 3.2,
    parite: { nb_hommes: 44, nb_femmes: 44, nb_total: 88, pct_hommes: 50, pct_femmes: 50 },
    topDepartementsElection: [],
    topPaysNaissance: [],
    topDepartementsNaissance: [],
    professionFamilles: [],
    professionCategories: [],
    trancheAge: [],
    extremes: {},
};

describe("GET /api/groupes/composition/[code]/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the composition DTO", async () => {
        getGroupeComposition.mockResolvedValue(ENTITY);

        const res = await call("REN", "17");

        expect(getGroupeComposition).toHaveBeenCalledWith("REN", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(expect.objectContaining({ groupeCountActifMembers: 88 }));
    });

    // Critères d'acceptation de #143.
    it("returns 404 for an unknown group (/api/groupes/composition/INEXISTANT/17)", async () => {
        getGroupeComposition.mockResolvedValue(null);

        const res = await call("INEXISTANT", "17");

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: "NOT_FOUND", message: "Groupe introuvable" });
    });

    it("returns 400 for a non-numeric legislature (/api/groupes/composition/RN/abc)", async () => {
        const res = await call("RN", "abc");

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "INVALID_INPUT", message: "Paramètre invalide" });
        expect(getGroupeComposition).not.toHaveBeenCalled();
    });

    it("returns 500 when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getGroupeComposition.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

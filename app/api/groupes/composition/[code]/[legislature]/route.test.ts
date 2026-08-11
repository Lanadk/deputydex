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

    it("returns 500 (not 404) when the group is not found", async () => {
        getGroupeComposition.mockResolvedValue(null);

        const res = await call("UNKNOWN", "17");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeComposition.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

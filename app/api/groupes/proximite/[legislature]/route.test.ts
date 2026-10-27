/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository", () => ({
    prismaGroupesStatsRepository: { getProximiteParPaire: jest.fn() },
}));

import { GET } from "@/app/api/groupes/proximite/[legislature]/route";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";

const getProximiteParPaire = prismaGroupesStatsRepository.getProximiteParPaire as jest.Mock;

function call(legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ legislature }) });
}

describe("GET /api/groupes/proximite/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the pairs sorted by proximity, forwarding legislature as a number", async () => {
        getProximiteParPaire.mockResolvedValue([
            { groupe_a_code: "LFI", groupe_a_label: "La France insoumise", groupe_b_code: "RN", groupe_b_label: "Rassemblement National", nb_scrutins_communs: 200, nb_scrutins_alignes: 40, taux_proximite: 0.2 },
            { groupe_a_code: "DEM", groupe_a_label: "Les Démocrates", groupe_b_code: "EPR", groupe_b_label: "Ensemble pour la République", nb_scrutins_communs: 200, nb_scrutins_alignes: 180, taux_proximite: 0.9 },
        ]);

        const res = await call("17");

        expect(getProximiteParPaire).toHaveBeenCalledWith(17);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.plusProches).toEqual(expect.objectContaining({ groupeACode: "DEM", groupeBCode: "EPR", tauxProximite: 90 }));
        expect(body.plusEloignes).toEqual(expect.objectContaining({ groupeACode: "LFI", groupeBCode: "RN", tauxProximite: 20 }));
    });

    it("returns 500 when the repository throws", async () => {
        getProximiteParPaire.mockRejectedValue(new Error("DB down"));

        const res = await call("17");

        expect(res.status).toBe(500);
    });
});

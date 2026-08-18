/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository", () => ({
    prismaActeursStatsRepository: {
        searchDeputies: jest.fn(),
        getAgeDistribution: jest.fn(),
        getGenderDistribution: jest.fn(),
        getMandatsCount: jest.fn(),
    },
}));

import { GET } from "@/app/api/acteurs/deputies/route";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";

const searchDeputies = prismaActeursStatsRepository.searchDeputies as jest.Mock;

function call(search?: string) {
    const url = search ? `http://localhost?search=${search}` : "http://localhost";
    return GET(new Request(url));
}

describe("GET /api/acteurs/deputies", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the mapped list", async () => {
        searchDeputies.mockResolvedValue([
            { uid: "PA1", prenom: "Amélie", nom: "Durand", profession_categorie: null, date_naissance: null },
        ]);

        const res = await call();

        expect(searchDeputies).toHaveBeenCalledWith(undefined);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([
            { id: "PA1", prenom: "Amélie", nom: "Durand", professionCategorie: null, dateNaissance: null },
        ]);
    });

    it("forwards the search query param", async () => {
        searchDeputies.mockResolvedValue([]);

        await call("dur");

        expect(searchDeputies).toHaveBeenCalledWith("dur");
    });

    it("returns 500 when the repository throws", async () => {
        searchDeputies.mockRejectedValue(new Error("DB down"));

        const res = await call();

        expect(res.status).toBe(500);
    });
});

import { searchDeputiesUseCase } from "@/app/domains/acteurs/use-cases/search-deputies.use-case";
import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";

function makeRepository(overrides: Partial<IActeursStatsRepository> = {}): IActeursStatsRepository {
    return {
        searchDeputies: jest.fn().mockResolvedValue([]),
        getAgeDistribution: jest.fn().mockResolvedValue([]),
        getGenderDistribution: jest.fn().mockResolvedValue([]),
        getMandatsCount: jest.fn().mockResolvedValue(0),
        getProfessionDistribution: jest.fn().mockResolvedValue([]),
        getProfessionFamilleDistribution: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("searchDeputiesUseCase", () => {
    it("maps every entity to a DTO, forwarding the search term", async () => {
        const repository = makeRepository({
            searchDeputies: jest.fn().mockResolvedValue([
                { uid: "PA1", prenom: "Amélie", nom: "Durand", profession_categorie: null, date_naissance: null },
            ]),
        });

        const result = await searchDeputiesUseCase(repository, "dur");

        expect(repository.searchDeputies).toHaveBeenCalledWith("dur");
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual([
            { id: "PA1", prenom: "Amélie", nom: "Durand", professionCategorie: null, dateNaissance: null },
        ]);
    });

    it("returns ok([]) when there is no data", async () => {
        const repository = makeRepository();

        const result = await searchDeputiesUseCase(repository);

        expect(result).toEqual({ success: true, data: [] });
    });
});

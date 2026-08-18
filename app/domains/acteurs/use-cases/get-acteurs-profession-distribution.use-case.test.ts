import { getActeursProfessionDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-profession-distribution.use-case";
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

describe("getActeursProfessionDistributionUseCase", () => {
    it("maps every bucket to a label/value item, forwarding the legislature filter", async () => {
        const repository = makeRepository({
            getProfessionDistribution: jest.fn().mockResolvedValue([
                { profession_categorie: "Cadres et professions intellectuelles supérieures", nb_acteurs: 320 },
                { profession_categorie: "Non renseignée", nb_acteurs: 12 },
            ]),
        });

        const result = await getActeursProfessionDistributionUseCase(repository, 17);

        expect(repository.getProfessionDistribution).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "Cadres et professions intellectuelles supérieures", value: 320 },
                { label: "Non renseignée", value: 12 },
            ],
        });
    });
});

import { getActeursProfessionFamilleDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-profession-famille-distribution.use-case";
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

describe("getActeursProfessionFamilleDistributionUseCase", () => {
    it("maps every bucket to a label/value item, forwarding the legislature filter", async () => {
        const repository = makeRepository({
            getProfessionFamilleDistribution: jest.fn().mockResolvedValue([
                { profession_famille: "Ouvriers", nb_acteurs: 6 },
                { profession_famille: "Agriculteurs exploitants", nb_acteurs: 15 },
            ]),
        });

        const result = await getActeursProfessionFamilleDistributionUseCase(repository, 17);

        expect(repository.getProfessionFamilleDistribution).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "Ouvriers", value: 6 },
                { label: "Agriculteurs exploitants", value: 15 },
            ],
        });
    });
});

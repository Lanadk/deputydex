import { getActeursGenderDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-gender-distribution.use-case";
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

describe("getActeursGenderDistributionUseCase", () => {
    it("maps every bucket to a label/value item, forwarding the legislature filter", async () => {
        const repository = makeRepository({
            getGenderDistribution: jest.fn().mockResolvedValue([
                { civilite: "M.", nb_acteurs: 64 },
                { civilite: "Mme", nb_acteurs: 36 },
            ]),
        });

        const result = await getActeursGenderDistributionUseCase(repository, 17);

        expect(repository.getGenderDistribution).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "Hommes", value: 64 },
                { label: "Femmes", value: 36 },
            ],
        });
    });

    it("calls the repository without a legislature when none is given", async () => {
        const repository = makeRepository();

        await getActeursGenderDistributionUseCase(repository);

        expect(repository.getGenderDistribution).toHaveBeenCalledWith(undefined);
    });
});

import { getActeursAgeDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-age-distribution.use-case";
import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";

function makeRepository(overrides: Partial<IActeursStatsRepository> = {}): IActeursStatsRepository {
    return {
        searchDeputies: jest.fn().mockResolvedValue([]),
        getAgeDistribution: jest.fn().mockResolvedValue([]),
        getGenderDistribution: jest.fn().mockResolvedValue([]),
        getMandatsCount: jest.fn().mockResolvedValue(0),
        ...overrides,
    };
}

describe("getActeursAgeDistributionUseCase", () => {
    it("always returns ok(...), mapping every bucket to a label/value item", async () => {
        const repository = makeRepository({
            getAgeDistribution: jest.fn().mockResolvedValue([
                { tranche_age: "<30", nb_acteurs: 12 },
                { tranche_age: "30-39", nb_acteurs: 45 },
            ]),
        });

        const result = await getActeursAgeDistributionUseCase(repository);

        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "<30", value: 12 },
                { label: "30-39", value: 45 },
            ],
        });
    });

    it("returns ok({ items: [] }) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getActeursAgeDistributionUseCase(repository);

        expect(result).toEqual({ success: true, data: { items: [] } });
    });

    it("forwards the legislature filter to the repository", async () => {
        const repository = makeRepository();

        await getActeursAgeDistributionUseCase(repository, 17);

        expect(repository.getAgeDistribution).toHaveBeenCalledWith(17);
    });
});

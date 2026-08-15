import { getActeurMandatsCountUseCase } from "@/app/domains/acteurs/use-cases/get-acteur-mandats-count.use-case";
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

describe("getActeurMandatsCountUseCase", () => {
    it("wraps the repository count in a DTO", async () => {
        const repository = makeRepository({ getMandatsCount: jest.fn().mockResolvedValue(3) });

        const result = await getActeurMandatsCountUseCase(repository, "PA1");

        expect(repository.getMandatsCount).toHaveBeenCalledWith("PA1");
        expect(result).toEqual({ success: true, data: { count: 3 } });
    });
});

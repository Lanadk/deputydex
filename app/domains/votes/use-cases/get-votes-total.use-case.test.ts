import { getVotesTotalUseCase } from "@/app/domains/votes/use-cases/get-votes-total.use-case";
import { IVotesStatsRepository } from "@/app/domains/votes/repositories/IVotesStatsRepository";

function makeRepository(overrides: Partial<IVotesStatsRepository> = {}): IVotesStatsRepository {
    return {
        getPositionsTotals: jest.fn().mockResolvedValue({
            total_pour: 0,
            total_contre: 0,
            total_abstentions: 0,
            total_non_votants: 0,
        }),
        countVotes: jest.fn().mockResolvedValue(0),
        ...overrides,
    };
}

describe("getVotesTotalUseCase", () => {
    it("wraps the repository count in a DTO", async () => {
        const repository = makeRepository({ countVotes: jest.fn().mockResolvedValue(431_250) });

        const result = await getVotesTotalUseCase(repository, 17);

        expect(repository.countVotes).toHaveBeenCalledWith(17);
        expect(result).toEqual({ success: true, data: { total: 431_250 } });
    });
});

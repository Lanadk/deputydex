import { getVotesPositionsStatUseCase } from "@/app/domains/votes/use-cases/get-votes-positions-stat.use-case";
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

describe("getVotesPositionsStatUseCase", () => {
    it("maps the repository totals to a DTO", async () => {
        const repository = makeRepository({
            getPositionsTotals: jest.fn().mockResolvedValue({
                total_pour: 210,
                total_contre: 180,
                total_abstentions: 40,
                total_non_votants: 147,
            }),
        });

        const result = await getVotesPositionsStatUseCase(repository);

        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "Pour", value: 210 },
                { label: "Contre", value: 180 },
                { label: "Abstention", value: 40 },
                { label: "Non-votant", value: 147 },
            ],
        });
    });
});

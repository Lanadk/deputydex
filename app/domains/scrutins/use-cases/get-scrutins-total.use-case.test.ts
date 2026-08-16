import { getScrutinsTotalUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-total.use-case";
import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";

function makeRepository(overrides: Partial<IScrutinsStatsRepository> = {}): IScrutinsStatsRepository {
    return {
        getParticipationEvolution: jest.fn().mockResolvedValue([]),
        countScrutins: jest.fn().mockResolvedValue(0),
        ...overrides,
    };
}

describe("getScrutinsTotalUseCase", () => {
    it("wraps the repository count in a DTO", async () => {
        const repository = makeRepository({ countScrutins: jest.fn().mockResolvedValue(742) });

        const result = await getScrutinsTotalUseCase(repository, 17);

        expect(repository.countScrutins).toHaveBeenCalledWith(17);
        expect(result).toEqual({ success: true, data: { total: 742 } });
    });
});

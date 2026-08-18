import { getScrutinsParticipationStatUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-participation-stat.use-case";
import { IScrutinsStatsRepository } from "@/app/domains/scrutins/repositories/IScrutinsStatsRepository";

function makeRepository(overrides: Partial<IScrutinsStatsRepository> = {}): IScrutinsStatsRepository {
    return {
        getParticipationEvolution: jest.fn().mockResolvedValue([]),
        countScrutins: jest.fn().mockResolvedValue(0),
        ...overrides,
    };
}

describe("getScrutinsParticipationStatUseCase", () => {
    it("maps every row to a label/value point", async () => {
        const repository = makeRepository({
            getParticipationEvolution: jest.fn().mockResolvedValue([{ mois: "2024-09", taux_participation: 78.5 }]),
        });

        const result = await getScrutinsParticipationStatUseCase(repository);

        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({ points: [{ label: "2024-09", value: 78.5 }] });
    });

    it("returns ok({points: []}) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getScrutinsParticipationStatUseCase(repository);

        expect(result).toEqual({ success: true, data: { points: [] } });
    });
});

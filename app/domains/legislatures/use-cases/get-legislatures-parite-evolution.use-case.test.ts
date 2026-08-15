import { getLegislaturesPariteEvolutionUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-parite-evolution.use-case";
import { ILegislaturesStatsRepository } from "@/app/domains/legislatures/repositories/ILegislaturesStatsRepository";

function makeRepository(overrides: Partial<ILegislaturesStatsRepository> = {}): ILegislaturesStatsRepository {
    return {
        getPariteEvolution: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getLegislaturesPariteEvolutionUseCase", () => {
    it("maps every row to a label/value point", async () => {
        const repository = makeRepository({
            getPariteEvolution: jest.fn().mockResolvedValue([{ legislature: 17, nb_hommes: 328, nb_femmes: 249 }]),
        });

        const result = await getLegislaturesPariteEvolutionUseCase(repository);

        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({ points: [{ label: "17ᵉ", value: 43.2 }] });
    });

    it("returns ok({points: []}) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getLegislaturesPariteEvolutionUseCase(repository);

        expect(result).toEqual({ success: true, data: { points: [] } });
    });
});

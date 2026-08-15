import { getGroupeStatPariteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite.use-case";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";

function makeRepository(overrides: Partial<IGroupesStatsRepository> = {}): IGroupesStatsRepository {
    return {
        getParite: jest.fn().mockResolvedValue(null),
        getEffectifs: jest.fn().mockResolvedValue([]),
        getCohesionEvolution: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatPariteUseCase", () => {
    it("maps the repository row to a DTO", async () => {
        const repository = makeRepository({ getParite: jest.fn().mockResolvedValue({ nb_hommes: 65, nb_femmes: 35 }) });

        const result = await getGroupeStatPariteUseCase(repository, "RN", 17);

        expect(repository.getParite).toHaveBeenCalledWith("RN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "Hommes", value: 65 },
                { label: "Femmes", value: 35 },
            ],
        });
    });

    it("returns ok({items: []}) when the group has no parité row", async () => {
        const repository = makeRepository();

        const result = await getGroupeStatPariteUseCase(repository, "UNKNOWN", 17);

        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

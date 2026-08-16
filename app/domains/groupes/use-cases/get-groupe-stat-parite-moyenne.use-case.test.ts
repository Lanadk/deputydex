import { getGroupeStatPariteMoyenneUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite-moyenne.use-case";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";

function makeRepository(overrides: Partial<IGroupesStatsRepository> = {}): IGroupesStatsRepository {
    return {
        getParite: jest.fn().mockResolvedValue(null),
        getPariteMoyenne: jest.fn().mockResolvedValue(null),
        getEffectifs: jest.fn().mockResolvedValue([]),
        getCohesionEvolution: jest.fn().mockResolvedValue([]),
        getPariteParGroupe: jest.fn().mockResolvedValue([]),
        getFeminisationMouvements: jest.fn().mockResolvedValue([]),
        getAgeParGroupe: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatPariteMoyenneUseCase", () => {
    it("maps the aggregated repository row to a DTO", async () => {
        const repository = makeRepository({ getPariteMoyenne: jest.fn().mockResolvedValue({ nb_hommes: 400, nb_femmes: 215 }) });

        const result = await getGroupeStatPariteMoyenneUseCase(repository, 17);

        expect(repository.getPariteMoyenne).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "Hommes", value: 400 },
                { label: "Femmes", value: 215 },
            ],
        });
    });

    it("returns ok({items: []}) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getGroupeStatPariteMoyenneUseCase(repository, 17);

        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

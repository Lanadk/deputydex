import { getGroupeStatEffectifsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-effectifs.use-case";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";

function makeRepository(overrides: Partial<IGroupesStatsRepository> = {}): IGroupesStatsRepository {
    return {
        getParite: jest.fn().mockResolvedValue(null),
        getPariteMoyenne: jest.fn().mockResolvedValue(null),
        getEffectifs: jest.fn().mockResolvedValue([]),
        getCohesionEvolution: jest.fn().mockResolvedValue([]),
        getPariteParGroupe: jest.fn().mockResolvedValue([]),
        getFeminisationMouvements: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatEffectifsUseCase", () => {
    it("maps every row to a label/value item", async () => {
        const repository = makeRepository({
            getEffectifs: jest.fn().mockResolvedValue([{ groupe_code: "RN", groupe_label: "Rassemblement National", nb_acteurs: 88 }]),
        });

        const result = await getGroupeStatEffectifsUseCase(repository, 17);

        expect(repository.getEffectifs).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({ items: [{ label: "Rassemblement National", value: 88 }] });
    });

    it("returns ok({items: []}) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getGroupeStatEffectifsUseCase(repository, 17);

        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

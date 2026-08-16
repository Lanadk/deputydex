import { getGroupeStatCohesionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion.use-case";
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
        getPositionsVoteParGroupe: jest.fn().mockResolvedValue([]),
        getExpressionVotesParGroupe: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatCohesionUseCase", () => {
    it("maps every row to a label/value point", async () => {
        const repository = makeRepository({
            getCohesionEvolution: jest.fn().mockResolvedValue([{ mois: new Date("2024-09-01"), taux_cohesion: 85 }]),
        });

        const result = await getGroupeStatCohesionUseCase(repository, "RN", 17);

        expect(repository.getCohesionEvolution).toHaveBeenCalledWith("RN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({ points: [{ label: "2024-09", value: 85 }] });
    });

    it("returns ok({points: []}) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getGroupeStatCohesionUseCase(repository, "RN", 17);

        expect(result).toEqual({ success: true, data: { points: [] } });
    });
});

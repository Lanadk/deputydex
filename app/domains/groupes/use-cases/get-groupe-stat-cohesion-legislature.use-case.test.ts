import { getGroupeStatCohesionLegislatureUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion-legislature.use-case";
import { IGroupesStatsRepository } from "@/app/domains/groupes/repositories/IGroupesStatsRepository";

function makeRepository(overrides: Partial<IGroupesStatsRepository> = {}): IGroupesStatsRepository {
    return {
        getParite: jest.fn().mockResolvedValue(null),
        getPariteMoyenne: jest.fn().mockResolvedValue(null),
        getEffectifs: jest.fn().mockResolvedValue([]),
        getCohesionEvolution: jest.fn().mockResolvedValue([]),
        getCohesionParGroupe: jest.fn().mockResolvedValue([]),
        getCohesionEvolutionTousGroupes: jest.fn().mockResolvedValue([]),
        getPariteParGroupe: jest.fn().mockResolvedValue([]),
        getFeminisationMouvements: jest.fn().mockResolvedValue([]),
        getAgeParGroupe: jest.fn().mockResolvedValue([]),
        getPositionsVoteParGroupe: jest.fn().mockResolvedValue([]),
        getExpressionVotesParGroupe: jest.fn().mockResolvedValue([]),
        getParticipationParGroupe: jest.fn().mockResolvedValue([]),
        getParticipationEvolutionParGroupe: jest.fn().mockResolvedValue([]),
        listGroupesLegislature: jest.fn().mockResolvedValue([]),
        getParticipationEvolutionTousGroupes: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatCohesionLegislatureUseCase", () => {
    it("maps repository rows to label/value items, converting the 0-1 scale to a %", async () => {
        const repository = makeRepository({
            getCohesionParGroupe: jest.fn().mockResolvedValue([
                { groupe_code: "RN", groupe_label: "Rassemblement National", taux_cohesion: 0.912 },
                { groupe_code: "LFI", groupe_label: "La France insoumise", taux_cohesion: 0.854 },
            ]),
        });

        const result = await getGroupeStatCohesionLegislatureUseCase(repository, 17);

        expect(repository.getCohesionParGroupe).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "RN", value: 91.2 },
                { label: "LFI", value: 85.4 },
            ],
        });
    });

    it("returns ok({items: []}) when there is no data", async () => {
        const repository = makeRepository();
        const result = await getGroupeStatCohesionLegislatureUseCase(repository, 17);
        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

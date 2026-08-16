import { getGroupeStatParticipationUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation.use-case";
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
        getParticipationParGroupe: jest.fn().mockResolvedValue([]),
        getParticipationEvolutionParGroupe: jest.fn().mockResolvedValue([]),
        listGroupesLegislature: jest.fn().mockResolvedValue([]),
        getParticipationEvolutionTousGroupes: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatParticipationUseCase", () => {
    it("maps repository rows to label/value items", async () => {
        const repository = makeRepository({
            getParticipationParGroupe: jest.fn().mockResolvedValue([
                { groupe_code: "RN", groupe_label: "Rassemblement National", taux_participation: 91.2 },
                { groupe_code: "LFI", groupe_label: "La France insoumise", taux_participation: 85.4 },
            ]),
        });

        const result = await getGroupeStatParticipationUseCase(repository, 17);

        expect(repository.getParticipationParGroupe).toHaveBeenCalledWith(17);
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
        const result = await getGroupeStatParticipationUseCase(repository, 17);
        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

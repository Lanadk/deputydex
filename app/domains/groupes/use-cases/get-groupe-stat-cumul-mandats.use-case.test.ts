import { getGroupeStatCumulMandatsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cumul-mandats.use-case";
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
        getCumulMandatsParGroupe: jest.fn().mockResolvedValue([]),
        getProximiteParPaire: jest.fn().mockResolvedValue([]),
        getPositionsVoteParGroupe: jest.fn().mockResolvedValue([]),
        getExpressionVotesParGroupe: jest.fn().mockResolvedValue([]),
        getParticipationParGroupe: jest.fn().mockResolvedValue([]),
        getParticipationEvolutionParGroupe: jest.fn().mockResolvedValue([]),
        listGroupesLegislature: jest.fn().mockResolvedValue([]),
        getParticipationEvolutionTousGroupes: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

describe("getGroupeStatCumulMandatsUseCase", () => {
    it("maps repository rows to label/value items (label = CODE, value = years), preserving order", async () => {
        const repository = makeRepository({
            getCumulMandatsParGroupe: jest.fn().mockResolvedValue([
                { groupe_code: "LIOT", groupe_label: "Libertés, Indépendants, Outre-mer et Territoires", average_cumulated_years: 7.4 },
                { groupe_code: "RN", groupe_label: "Rassemblement National", average_cumulated_years: 3.1 },
            ]),
        });

        const result = await getGroupeStatCumulMandatsUseCase(repository, 17);

        expect(repository.getCumulMandatsParGroupe).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "LIOT", value: 7.4 },
                { label: "RN", value: 3.1 },
            ],
        });
    });

    it("returns ok({items: []}) when there is no data", async () => {
        const repository = makeRepository();
        const result = await getGroupeStatCumulMandatsUseCase(repository, 17);
        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

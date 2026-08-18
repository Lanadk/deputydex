import { getGroupeStatExpressionVotesUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-expression-votes.use-case";
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

describe("getGroupeStatExpressionVotesUseCase", () => {
    it("maps repository rows to label/value items, one per groupe (label = code)", async () => {
        const repository = makeRepository({
            getExpressionVotesParGroupe: jest.fn().mockResolvedValue([
                { groupe_code: "RN", groupe_label: "Rassemblement National", taux_expression_votes: 92.5 },
                { groupe_code: "LFI", groupe_label: "La France insoumise", taux_expression_votes: 88.1 },
            ]),
        });

        const result = await getGroupeStatExpressionVotesUseCase(repository, 17);

        expect(repository.getExpressionVotesParGroupe).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            items: [
                { label: "RN", value: 92.5 },
                { label: "LFI", value: 88.1 },
            ],
        });
    });

    it("returns ok({items: []}) when there is no data", async () => {
        const repository = makeRepository();

        const result = await getGroupeStatExpressionVotesUseCase(repository, 17);

        expect(result).toEqual({ success: true, data: { items: [] } });
    });
});

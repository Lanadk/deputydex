import { getGroupeStatParticipationEvolutionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation-evolution.use-case";
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

describe("getGroupeStatParticipationEvolutionUseCase", () => {
    it("maps repository rows to label/value points, forwarding code and legislature", async () => {
        const repository = makeRepository({
            getParticipationEvolutionParGroupe: jest.fn().mockResolvedValue([
                { mois: new Date("2024-09-01"), taux_participation_moyen: 88.5 },
            ]),
        });

        const result = await getGroupeStatParticipationEvolutionUseCase(repository, "SOC-NUPES", 16);

        expect(repository.getParticipationEvolutionParGroupe).toHaveBeenCalledWith("SOC-NUPES", 16);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({ points: [{ label: "2024-09", value: 88.5 }] });
    });
});

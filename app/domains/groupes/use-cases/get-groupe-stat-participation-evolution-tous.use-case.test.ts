import { getGroupeStatParticipationEvolutionTousUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-participation-evolution-tous.use-case";
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

describe("getGroupeStatParticipationEvolutionTousUseCase", () => {
    it("groups rows by groupe_code into one series per group, named by CODE", async () => {
        const repository = makeRepository({
            getParticipationEvolutionTousGroupes: jest.fn().mockResolvedValue([
                { groupe_code: "RN", groupe_label: "Rassemblement National", mois: new Date("2024-09-01"), taux_participation_moyen: 91.2 },
                { groupe_code: "RN", groupe_label: "Rassemblement National", mois: new Date("2024-10-01"), taux_participation_moyen: 88.5 },
                { groupe_code: "SOC-NUPES", groupe_label: "Socialistes et apparentés - NUPES", mois: new Date("2022-07-01"), taux_participation_moyen: 80.0 },
            ]),
        });

        const result = await getGroupeStatParticipationEvolutionTousUseCase(repository, 17);

        expect(repository.getParticipationEvolutionTousGroupes).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            series: [
                { name: "RN", items: [{ label: "2024-09", value: 91.2 }, { label: "2024-10", value: 88.5 }] },
                { name: "SOC-NUPES", items: [{ label: "2022-07", value: 80.0 }] },
            ],
        });
    });
});

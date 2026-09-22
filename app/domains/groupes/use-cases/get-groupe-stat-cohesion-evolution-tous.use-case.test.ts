import { getGroupeStatCohesionEvolutionTousUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion-evolution-tous.use-case";
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

describe("getGroupeStatCohesionEvolutionTousUseCase", () => {
    it("groups repository rows by groupe_code into one series per group, converting the 0-1 scale to a %", async () => {
        const repository = makeRepository({
            getCohesionEvolutionTousGroupes: jest.fn().mockResolvedValue([
                { groupe_code: "RN", groupe_label: "Rassemblement National", mois: new Date("2024-09-01"), taux_cohesion: 0.912 },
                { groupe_code: "SOC-NUPES", groupe_label: "Socialistes et apparentés - NUPES", mois: new Date("2022-07-01"), taux_cohesion: null },
            ]),
        });

        const result = await getGroupeStatCohesionEvolutionTousUseCase(repository, 17);

        expect(repository.getCohesionEvolutionTousGroupes).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual({
            series: [
                { name: "RN", items: [{ label: "2024-09", value: 91.2 }] },
                { name: "SOC-NUPES", items: [{ label: "2022-07", value: 0 }] },
            ],
        });
    });

    it("returns ok({series: []}) when there is no data", async () => {
        const repository = makeRepository();
        const result = await getGroupeStatCohesionEvolutionTousUseCase(repository, 17);
        expect(result).toEqual({ success: true, data: { series: [] } });
    });
});

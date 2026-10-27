import { getGroupesProximiteUseCase } from "@/app/domains/groupes/use-cases/get-groupes-proximite.use-case";
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

describe("getGroupesProximiteUseCase", () => {
    it("forwards the legislature and resolves the government reference group for it (EPR in the 17th)", async () => {
        const repository = makeRepository({
            getProximiteParPaire: jest.fn().mockResolvedValue([
                { groupe_a_code: "DEM", groupe_a_label: "Les Démocrates", groupe_b_code: "EPR", groupe_b_label: "Ensemble pour la République", nb_scrutins_communs: 120, taux_proximite: 0.91 },
            ]),
        });

        const result = await getGroupesProximiteUseCase(repository, 17);

        expect(repository.getProximiteParPaire).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data.gouvernementReference).toEqual({ code: "EPR", label: "Ensemble pour la République" });
        expect(result.data.proximiteGouvernement).toEqual([
            { groupeCode: "DEM", groupeLabel: "Les Démocrates", tauxProximite: 91, nbScrutinsCommuns: 120 },
        ]);
    });

    it("has no government reference for a legislature without one", async () => {
        const result = await getGroupesProximiteUseCase(makeRepository(), 15);

        if (!result.success) throw new Error("expected success");
        expect(result.data.gouvernementReference).toBeNull();
        expect(result.data.paires).toEqual([]);
    });
});

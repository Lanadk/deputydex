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
                { groupe_a_code: "DEM", groupe_a_label: "Les Démocrates", groupe_b_code: "EPR", groupe_b_label: "Ensemble pour la République", nb_scrutins_communs: 100, nb_scrutins_alignes: 91, taux_proximite: 0.91 },
            ]),
        });

        const result = await getGroupesProximiteUseCase(repository, 17);

        expect(repository.getProximiteParPaire).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data.gouvernementReference).toEqual({ code: "EPR", label: "Ensemble pour la République" });
        expect(result.data.proximiteGouvernement).toEqual([
            { groupeCode: "DEM", groupeLabel: "Les Démocrates", tauxProximite: 91, nbScrutinsCommuns: 100 },
        ]);
    });

    it("applies the legislature's renamed-group lineage (UDR + UDDPLR in the 17th, SOC-NUPES + SOC in the 16th)", async () => {
        const rows17 = [
            { groupe_a_code: "RN", groupe_a_label: "Rassemblement National", groupe_b_code: "UDR", groupe_b_label: "Union des droites pour la République", nb_scrutins_communs: 300, nb_scrutins_alignes: 270, taux_proximite: 0.9 },
            { groupe_a_code: "RN", groupe_a_label: "Rassemblement National", groupe_b_code: "UDDPLR", groupe_b_label: "Union des droites pour la République", nb_scrutins_communs: 100, nb_scrutins_alignes: 70, taux_proximite: 0.7 },
        ];
        const result17 = await getGroupesProximiteUseCase(makeRepository({ getProximiteParPaire: jest.fn().mockResolvedValue(rows17) }), 17);
        if (!result17.success) throw new Error("expected success");
        expect(result17.data.paires).toEqual([expect.objectContaining({ groupeACode: "RN", groupeBCode: "UDDPLR", tauxProximite: 85, nbScrutinsCommuns: 400 })]);

        const rows16 = [
            { groupe_a_code: "RE", groupe_a_label: "Renaissance", groupe_b_code: "SOC-NUPES", groupe_b_label: "Socialistes et apparentés - NUPES", nb_scrutins_communs: 100, nb_scrutins_alignes: 30, taux_proximite: 0.3 },
            { groupe_a_code: "RE", groupe_a_label: "Renaissance", groupe_b_code: "SOC", groupe_b_label: "Socialistes et apparentés", nb_scrutins_communs: 100, nb_scrutins_alignes: 50, taux_proximite: 0.5 },
        ];
        const result16 = await getGroupesProximiteUseCase(makeRepository({ getProximiteParPaire: jest.fn().mockResolvedValue(rows16) }), 16);
        if (!result16.success) throw new Error("expected success");
        expect(result16.data.proximiteGouvernement).toEqual([
            { groupeCode: "SOC", groupeLabel: "Socialistes et apparentés", tauxProximite: 40, nbScrutinsCommuns: 200 },
        ]);
    });

    it("has no government reference for a legislature without one", async () => {
        const result = await getGroupesProximiteUseCase(makeRepository(), 15);

        if (!result.success) throw new Error("expected success");
        expect(result.data.gouvernementReference).toBeNull();
        expect(result.data.paires).toEqual([]);
    });
});

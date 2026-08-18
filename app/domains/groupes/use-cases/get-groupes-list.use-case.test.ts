import { getGroupesListUseCase } from "@/app/domains/groupes/use-cases/get-groupes-list.use-case";
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

describe("getGroupesListUseCase", () => {
    it("maps repository rows to code/label items, NI and 0-member groups included as-is", async () => {
        const repository = makeRepository({
            listGroupesLegislature: jest.fn().mockResolvedValue([
                { groupe_code: "SOC", groupe_label: "Socialistes et apparentés" },
                { groupe_code: "SOC-NUPES", groupe_label: "Socialistes et apparentés - NUPES" },
                { groupe_code: "NI-16", groupe_label: "Non inscrits" },
            ]),
        });

        const result = await getGroupesListUseCase(repository, 16);

        expect(repository.listGroupesLegislature).toHaveBeenCalledWith(16);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual([
            { code: "SOC", label: "Socialistes et apparentés" },
            { code: "SOC-NUPES", label: "Socialistes et apparentés - NUPES" },
            { code: "NI-16", label: "Non inscrits" },
        ]);
    });

    it("falls back to the code when groupe_label is null", async () => {
        const repository = makeRepository({
            listGroupesLegislature: jest.fn().mockResolvedValue([{ groupe_code: "TBD2", groupe_label: null }]),
        });

        const result = await getGroupesListUseCase(repository, 16);

        expect(result).toEqual({ success: true, data: [{ code: "TBD2", label: "TBD2" }] });
    });
});

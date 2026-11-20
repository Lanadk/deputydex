import { getGroupeCompositionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-composition.use-case";
import { IGroupeCompositionRepository } from "@/app/domains/groupes/repositories/IGroupeCompositionRepository";
import { GroupeCompositionEntity } from "@/app/domains/groupes/entities/groupe-composition.entity";

function makeEntity(overrides: Partial<GroupeCompositionEntity> = {}): GroupeCompositionEntity {
    return {
        groupeCountMembers: 88,
        averageAge: 47.5,
        averageCumulatedYears: 3.2,
        parite: { nb_hommes: 44, nb_femmes: 44, nb_total: 88, pct_hommes: 50, pct_femmes: 50 },
        topDepartementsElection: [],
        topPaysNaissance: [],
        topDepartementsNaissance: [],
        professionFamilles: [],
        professionCategories: [],
        trancheAge: [],
        extremes: {},
        ...overrides,
    };
}

describe("getGroupeCompositionUseCase", () => {
    it("returns ok(dto) when the repository finds the group", async () => {
        const repository: IGroupeCompositionRepository = {
            getGroupeComposition: jest.fn().mockResolvedValue(makeEntity()),
        };

        const result = await getGroupeCompositionUseCase(repository, "REN", 17);

        expect(repository.getGroupeComposition).toHaveBeenCalledWith("REN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data.groupeParite).toEqual({ homme: 50, femme: 50 });
    });

    it("returns err('NOT_FOUND') when the repository resolves null (unknown group)", async () => {
        const repository: IGroupeCompositionRepository = {
            getGroupeComposition: jest.fn().mockResolvedValue(null),
        };

        const result = await getGroupeCompositionUseCase(repository, "UNKNOWN", 17);

        expect(result).toEqual({ success: false, error: "NOT_FOUND" });
    });

    it("returns err('DB_ERROR') when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const repository: IGroupeCompositionRepository = {
            getGroupeComposition: jest.fn().mockRejectedValue(new Error("DB down")),
        };

        const result = await getGroupeCompositionUseCase(repository, "REN", 17);

        expect(result).toEqual({ success: false, error: "DB_ERROR" });
    });
});

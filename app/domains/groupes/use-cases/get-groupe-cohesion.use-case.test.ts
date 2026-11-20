import { getGroupeCohesionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-cohesion.use-case";
import { IGroupeCohesionRepository } from "@/app/domains/groupes/repositories/IGroupeCohesionRepository";
import { GroupeCohesionEntity } from "@/app/domains/groupes/entities/groupe-cohesion.entity";

describe("getGroupeCohesionUseCase", () => {
    it("returns ok(dto) when the repository resolves data", async () => {
        const entity: GroupeCohesionEntity = {
            evolutionCohesionLegislature: [{ mois: new Date("2024-07-01"), taux_cohesion: 0.92 }],
            cohesionLegislature: null,
            couvertureScrutins: null,
            participationLegislature: null,
            proximiteGouvernement: null,
        };
        const repository: IGroupeCohesionRepository = {
            getGroupeCohesionLegislature: jest.fn().mockResolvedValue(entity),
        };

        const result = await getGroupeCohesionUseCase(repository, "REN", 17);

        expect(repository.getGroupeCohesionLegislature).toHaveBeenCalledWith("REN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data.evolutionCohesionLegislature).toEqual([{ key: "2024-07", value: 0.92 }]);
    });

    it("returns err('DB_ERROR') when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const repository: IGroupeCohesionRepository = {
            getGroupeCohesionLegislature: jest.fn().mockRejectedValue(new Error("DB down")),
        };

        const result = await getGroupeCohesionUseCase(repository, "REN", 17);

        expect(result).toEqual({ success: false, error: "DB_ERROR" });
    });
});

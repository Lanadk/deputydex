import { getGroupeComportementUseCase } from "@/app/domains/groupes/use-cases/get-groupe-comportement.use-case";
import { IGroupeComportementRepository } from "@/app/domains/groupes/repositories/IGroupeComportementRepository";
import { GroupeComportementEntity } from "@/app/domains/groupes/entities/groupe-comportement.entity";

describe("getGroupeComportementUseCase", () => {
    it("returns ok(dto) when the repository resolves data", async () => {
        const entity: GroupeComportementEntity = {
            participationLegislature: [{ mois: new Date("2024-07-01"), taux_participation_moyen_deputes: 0.75 }],
        };
        const repository: IGroupeComportementRepository = {
            getGroupeComportementLegislature: jest.fn().mockResolvedValue(entity),
        };

        const result = await getGroupeComportementUseCase(repository, "REN", 17);

        expect(repository.getGroupeComportementLegislature).toHaveBeenCalledWith("REN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data.evolutionParticipationLegislature).toEqual([{ key: "2024-07", value: 0.75 }]);
    });

    it("returns err('ERROR') when the repository resolves a falsy value", async () => {
        const repository: IGroupeComportementRepository = {
            getGroupeComportementLegislature: jest
                .fn()
                .mockResolvedValue(null as unknown as GroupeComportementEntity),
        };

        const result = await getGroupeComportementUseCase(repository, "UNKNOWN", 17);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });
});

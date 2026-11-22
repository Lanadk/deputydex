import { getGroupeActivityDetailsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-activity-details.use-case";
import { IGroupeActivityDetailsRepository } from "@/app/domains/groupes/repositories/IGroupeActivityDetailsRepository";
import { GroupeActivityDetailsEntity } from "@/app/domains/groupes/entities/groupe-activity-details.entity";

describe("getGroupeActivityDetailsUseCase", () => {
    it("returns ok(dtos) forwarding code/legislature/date to the repository", async () => {
        const date = new Date("2024-07-08");
        const entities: GroupeActivityDetailsEntity[] = [
            {
                activity_date: date, domain: "vote", ref_id: "VTANR5L17V1", meta: { type: "vote" },
                scrutin_numero: "1", dossier_uid: null, dossier_titre: null, dossier_legislature: null,
            },
        ];
        const repository: IGroupeActivityDetailsRepository = {
            getGroupeActivityDetails: jest.fn().mockResolvedValue(entities),
        };

        const result = await getGroupeActivityDetailsUseCase(repository, "REN", 17, date);

        expect(repository.getGroupeActivityDetails).toHaveBeenCalledWith("REN", 17, date);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual([
            {
                date: "2024-07-08", domain: "vote", refId: "VTANR5L17V1", meta: { type: "vote" },
                lienAN: "https://www.assemblee-nationale.fr/dyn/17/scrutins/1", dossier: null,
            },
        ]);
    });

    it("returns err('DB_ERROR') when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const repository: IGroupeActivityDetailsRepository = {
            getGroupeActivityDetails: jest.fn().mockRejectedValue(new Error("DB down")),
        };

        const result = await getGroupeActivityDetailsUseCase(repository, "REN", 17, new Date());

        expect(result).toEqual({ success: false, error: "DB_ERROR" });
    });
});

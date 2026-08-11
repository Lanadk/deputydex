import { getGroupeActivityUseCase } from "@/app/domains/groupes/use-cases/get-groupe-activity.use-case";
import { IGroupeActivityRepository } from "@/app/domains/groupes/repositories/IGroupeActivityRepository";
import { GroupeActivityEntity } from "@/app/domains/groupes/entities/groupe-activity.entity";

describe("getGroupeActivityUseCase", () => {
    it("returns ok(dto) mapping the daily activity calendar", async () => {
        const entities: GroupeActivityEntity[] = [{ activity_date: new Date("2024-07-08"), total_count: 5 }];
        const repository: IGroupeActivityRepository = {
            getGroupeActivity: jest.fn().mockResolvedValue(entities),
        };

        const result = await getGroupeActivityUseCase(repository, "REN", 17);

        expect(repository.getGroupeActivity).toHaveBeenCalledWith("REN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual([{ date: "2024-07-08", count: 5, level: 1 }]);
    });

    it("returns err('ERROR') when the repository resolves null", async () => {
        const repository: IGroupeActivityRepository = {
            getGroupeActivity: jest.fn().mockResolvedValue(null as unknown as GroupeActivityEntity[]),
        };

        const result = await getGroupeActivityUseCase(repository, "UNKNOWN", 17);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });
});

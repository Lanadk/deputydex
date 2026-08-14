import { getGroupeInfosUseCase } from "@/app/domains/groupes/use-cases/get-groupe-infos.use-case";
import { IGroupeInfosRepository } from "@/app/domains/groupes/repositories/IGroupeInfosRepository";
import { GroupeInfosEntity } from "@/app/domains/groupes/entities/groupe-infos.entity";

function makeEntity(overrides: Partial<GroupeInfosEntity> = {}): GroupeInfosEntity {
    return {
        legislature: 17,
        groupe_id: "1",
        groupe_label: "Renaissance",
        groupe_code: "REN",
        groupe_position: "Centre",
        groupe_count_members: 88,
        groupe_rank: 2,
        groupe_year_of_creation: "2016",
        groupe_web_site: "https://example.org",
        groupe_president_full_name: "Jane Doe",
        groupe_quality_sex_label: "Présidente",
        groupe_seats_share_percent: 15.3,
        ...overrides,
    };
}

describe("getGroupeInfosUseCase", () => {
    it("returns ok(dto) when the repository resolves a row", async () => {
        const repository: IGroupeInfosRepository = {
            getGroupeInfos: jest.fn().mockResolvedValue([makeEntity()]),
        };

        const result = await getGroupeInfosUseCase(repository, "REN", 17);

        expect(repository.getGroupeInfos).toHaveBeenCalledWith("REN", 17);
        expect(result.success).toBe(true);
        if (!result.success) throw new Error("expected success");
        expect(result.data.groupeCode).toBe("REN");
    });

    it("returns err('ERROR') when the repository resolves null/undefined (group not found)", async () => {
        const repository: IGroupeInfosRepository = {
            getGroupeInfos: jest.fn().mockResolvedValue(null as unknown as GroupeInfosEntity[]),
        };

        const result = await getGroupeInfosUseCase(repository, "UNKNOWN", 17);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });

    // Cas réel : un code de groupe existant dans une autre législature (ex:
    // "NI-16", "RE") mais absent de celle demandée. Le repository renvoie un
    // tableau vide (pas null/undefined) — doit être traité comme "not found".
    it("returns err('ERROR') when the repository resolves an empty array (code not found for this legislature)", async () => {
        const repository: IGroupeInfosRepository = {
            getGroupeInfos: jest.fn().mockResolvedValue([]),
        };

        const result = await getGroupeInfosUseCase(repository, "NI-16", 17);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });
});

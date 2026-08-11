import { getGroupeCardsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-cards.use-case";
import { IGroupesCardsRepository } from "@/app/domains/groupes/repositories/IGroupesCardsRepository";
import { GroupeCardEntity } from "@/app/domains/groupes/entities/groupe-card.entity";

describe("getGroupeCardsUseCase", () => {
    it("returns ok(dtos) mapping every group card for the given legislature", async () => {
        const entities: GroupeCardEntity[] = [
            {
                groupe_id: "1",
                groupe_code: "REN",
                groupe_label: "Renaissance",
                groupe_president_full_name: "Jane Doe",
                groupe_label_type_sex: "Présidente",
                groupe_count_members: 88,
            },
        ];
        const repository: IGroupesCardsRepository = {
            getGroupesCards: jest.fn().mockResolvedValue(entities),
        };

        const result = await getGroupeCardsUseCase(repository, 17);

        expect(repository.getGroupesCards).toHaveBeenCalledWith(17);
        if (!result.success) throw new Error("expected success");
        expect(result.data[0]).toEqual({
            groupeId: "1",
            groupeCode: "REN",
            groupeLabel: "Renaissance",
            groupePresidentFullName: "Jane Doe",
            groupeQualitySexLabel: "Présidente",
            groupeCountMembers: 88,
            groupeHref: "/groupes/REN",
            groupeImg: "/tribun/17/logos_groupes/REN.png",
        });
    });

    it("returns err('ERROR') when the repository resolves null", async () => {
        const repository: IGroupesCardsRepository = {
            getGroupesCards: jest.fn().mockResolvedValue(null as unknown as GroupeCardEntity[]),
        };

        const result = await getGroupeCardsUseCase(repository, 17);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });
});

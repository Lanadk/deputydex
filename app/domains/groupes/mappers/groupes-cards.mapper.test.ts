import { mapEntityToDTO, mapGroupeCardRowEntityToGroupeCardDTO } from "@/app/domains/groupes/mappers/groupes-cards.mapper";
import { GroupeCardEntity } from "@/app/domains/groupes/entities/groupe-card.entity";

function makeEntity(overrides: Partial<GroupeCardEntity> = {}): GroupeCardEntity {
    return {
        groupe_id: "1",
        groupe_code: "REN",
        groupe_label: "Renaissance",
        groupe_president_full_name: "Jane Doe",
        groupe_label_type_sex: "Présidente",
        groupe_count_members: 88,
        ...overrides,
    };
}

describe("mapGroupeCardRowEntityToGroupeCardDTO", () => {
    it("builds the href and logo path from legislature + groupe_code", () => {
        const dto = mapGroupeCardRowEntityToGroupeCardDTO(17, makeEntity({ groupe_code: "REN" }));

        expect(dto.groupeHref).toBe("/groupes/REN");
        expect(dto.groupeImg).toBe("/tribun/17/logos_groupes/REN.png");
    });

    it("returns a null logo for non-inscrit ('NI') groups instead of a broken image path", () => {
        const dto = mapGroupeCardRowEntityToGroupeCardDTO(17, makeEntity({ groupe_code: "NI" }));

        expect(dto.groupeImg).toBeNull();
    });

    it("coerces groupe_count_members via Number() and defaults nullable string fields to ''", () => {
        const dto = mapGroupeCardRowEntityToGroupeCardDTO(
            17,
            makeEntity({
                groupe_code: null,
                groupe_label: null,
                groupe_president_full_name: null,
                groupe_label_type_sex: null,
                groupe_count_members: "88" as unknown as number,
            })
        );

        expect(dto).toMatchObject({
            groupeCode: "",
            groupeLabel: "",
            groupePresidentFullName: "",
            groupeQualitySexLabel: "",
            groupeCountMembers: 88,
        });
    });
});

describe("mapEntityToDTO", () => {
    it("maps a list of cards, preserving order", () => {
        const list = mapEntityToDTO(17, [makeEntity({ groupe_code: "REN" }), makeEntity({ groupe_code: "RN" })]);

        expect(list.map((c) => c.groupeCode)).toEqual(["REN", "RN"]);
    });
});

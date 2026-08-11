import { mapEntityToGroupeInfosDTO } from "@/app/domains/groupes/mappers/groupe-infos.mapper";
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

describe("mapEntityToGroupeInfosDTO", () => {
    it("maps the first row of the entity list, building the group logo path from legislature + code", () => {
        const dto = mapEntityToGroupeInfosDTO(17, [makeEntity({ groupe_code: "REN" })]);

        expect(dto).toEqual({
            legislature: 17,
            groupeLabel: "Renaissance",
            groupeCode: "REN",
            groupePosition: "Centre",
            groupeCountMembers: 88,
            groupeRank: 2,
            groupeYearOfCreation: "2016",
            groupeWebSite: "https://example.org",
            groupeImg: "/tribun/17/logos_groupes/REN.png",
            groupePresidentFullName: "Jane Doe",
            groupeQualitySexLabel: "Présidente",
            groupeSeatsSharePercent: 15.3,
        });
    });

    it("ignores any row beyond the first one", () => {
        const dto = mapEntityToGroupeInfosDTO(17, [
            makeEntity({ groupe_code: "REN" }),
            makeEntity({ groupe_code: "RN" }),
        ]);

        expect(dto.groupeCode).toBe("REN");
    });

    it("coerces stringly-typed numeric fields (as raw SQL often returns them) via Number()", () => {
        // $queryRaw sur Postgres renvoie souvent les colonnes numeric/bigint sous
        // forme de string — le mapper doit les convertir. On simule ça avec un
        // cast, le type d'entité déclaré ne reflétant pas la réalité runtime.
        const rawRow = {
            ...makeEntity(),
            groupe_count_members: "88",
            groupe_seats_share_percent: "15.3",
        } as unknown as GroupeInfosEntity;

        const dto = mapEntityToGroupeInfosDTO(17, [rawRow]);

        expect(dto.groupeCountMembers).toBe(88);
        expect(dto.groupeSeatsSharePercent).toBe(15.3);
    });
});

import { mapEntityToGroupeMembersDTO } from "@/app/domains/groupes/mappers/groupe-members.mapper";
import { GroupeMembersEntity } from "@/app/domains/groupes/entities/groupe-members.entity";

describe("mapEntityToGroupeMembersDTO", () => {
    it("maps snake_case entity fields to their camelCase DTO equivalents", () => {
        const entities: GroupeMembersEntity[] = [
            { first_name: "Jean", last_name: "Dupont", since: new Date("2024-07-08"), circonscription: "1ère (Paris)", age: 52 },
        ];

        expect(mapEntityToGroupeMembersDTO(entities)).toEqual([
            {
                deputyFirstName: "Jean",
                deputyLastName: "Dupont",
                since: new Date("2024-07-08"),
                circonscription: "1ère (Paris)",
                age: 52,
            },
        ]);
    });

    it("maps an empty list to an empty list", () => {
        expect(mapEntityToGroupeMembersDTO([])).toEqual([]);
    });
});

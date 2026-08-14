import { mapEntitiesToGroupeLegislaturesDTO } from "@/app/domains/groupes/mappers/groupe-legislatures.mapper";
import { GroupeLegislatureEntity } from "@/app/domains/groupes/entities/groupe-legislatures.entity";

describe("mapEntitiesToGroupeLegislaturesDTO", () => {
    it("maps a list of entities to a flat list of legislature numbers", () => {
        const entities: GroupeLegislatureEntity[] = [
            { legislature: 16 },
            { legislature: 17 },
        ];

        expect(mapEntitiesToGroupeLegislaturesDTO(entities)).toEqual([16, 17]);
    });

    it("maps an empty list to an empty list", () => {
        expect(mapEntitiesToGroupeLegislaturesDTO([])).toEqual([]);
    });
});

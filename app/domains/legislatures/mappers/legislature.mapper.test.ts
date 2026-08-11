import { mapLegislatureToDTO, mapLegislaturesToDTO } from "@/app/domains/legislatures/mappers/legislature.mapper";
import { LegislatureEntity } from "@/app/domains/legislatures/entities/legislature.entity";

describe("mapLegislatureToDTO", () => {
    it("formats start/end dates as ISO strings", () => {
        const entity: LegislatureEntity = {
            id: 2,
            number: 17,
            startDate: new Date("2024-07-08T00:00:00Z"),
            endDate: new Date("2029-06-30T00:00:00Z"),
        };

        expect(mapLegislatureToDTO(entity)).toEqual({
            id: 2,
            number: 17,
            startDate: "2024-07-08T00:00:00.000Z",
            endDate: "2029-06-30T00:00:00.000Z",
        });
    });

    it("maps a null endDate (ongoing legislature) to null rather than throwing", () => {
        const entity: LegislatureEntity = {
            id: 2,
            number: 17,
            startDate: new Date("2024-07-08T00:00:00Z"),
            endDate: null,
        };

        expect(mapLegislatureToDTO(entity).endDate).toBeNull();
    });
});

describe("mapLegislaturesToDTO", () => {
    it("maps a list preserving order", () => {
        const entities: LegislatureEntity[] = [
            { id: 1, number: 16, startDate: null, endDate: null },
            { id: 2, number: 17, startDate: null, endDate: null },
        ];

        expect(mapLegislaturesToDTO(entities).map((d) => d.number)).toEqual([16, 17]);
    });
});

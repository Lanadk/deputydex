import { mapEntityToGroupeActivityDTO } from "@/app/domains/groupes/mappers/groupe-activity.mapper";
import { GroupeActivityEntity } from "@/app/domains/groupes/entities/groupe-activity.entity";

function entry(total_count: number, date = "2024-07-08"): GroupeActivityEntity {
    return { activity_date: new Date(date), total_count };
}

describe("mapEntityToGroupeActivityDTO", () => {
    it("formats the date as yyyy-mm-dd", () => {
        const dto = mapEntityToGroupeActivityDTO([entry(5, "2024-07-08")]);
        expect(dto[0].date).toBe("2024-07-08");
    });

    it("returns an empty array for a null/undefined/empty entity list", () => {
        expect(mapEntityToGroupeActivityDTO(null as unknown as GroupeActivityEntity[])).toEqual([]);
        expect(mapEntityToGroupeActivityDTO(undefined as unknown as GroupeActivityEntity[])).toEqual([]);
        expect(mapEntityToGroupeActivityDTO([])).toEqual([]);
    });

    // Les seuils de `toLevel` pilotent la coloration du calendrier d'activité —
    // ce sont les bornes exactes qui comptent.
    it.each([
        [0, 0],
        [1, 1],
        [20, 1],
        [21, 2],
        [100, 2],
        [101, 3],
        [200, 3],
        [201, 4],
        [1000, 4],
    ])("maps a count of %d to level %d", (count, expectedLevel) => {
        const dto = mapEntityToGroupeActivityDTO([entry(count)]);
        expect(dto[0]).toEqual({ date: "2024-07-08", count, level: expectedLevel });
    });

    it("coerces a null/undefined total_count to 0 (level 0)", () => {
        const dto = mapEntityToGroupeActivityDTO([
            { activity_date: new Date("2024-07-08"), total_count: null as unknown as number },
        ]);
        expect(dto[0]).toEqual({ date: "2024-07-08", count: 0, level: 0 });
    });
});

import { mapEntityToGroupeActivityDetailsDTO } from "@/app/domains/groupes/mappers/groupe-activity-details.mapper";
import { GroupeActivityDetailsEntity } from "@/app/domains/groupes/entities/groupe-activity-details.entity";

describe("mapEntityToGroupeActivityDetailsDTO", () => {
    it("formats the date as yyyy-mm-dd and renames ref_id to refId", () => {
        const entities: GroupeActivityDetailsEntity[] = [
            { activity_date: new Date("2024-07-08"), domain: "vote", ref_id: "VTANR5L17V1", meta: { type: "vote" } },
        ];

        expect(mapEntityToGroupeActivityDetailsDTO(entities)).toEqual([
            { date: "2024-07-08", domain: "vote", refId: "VTANR5L17V1", meta: { type: "vote" } },
        ]);
    });

    it("maps an empty list to an empty list", () => {
        expect(mapEntityToGroupeActivityDetailsDTO([])).toEqual([]);
    });

    it("passes the meta object through untouched, whatever its shape", () => {
        const meta = { type: "amendement", sort: "adopte", extra: 42 };
        const entities: GroupeActivityDetailsEntity[] = [
            { activity_date: new Date("2024-07-08"), domain: "amendement", ref_id: "AMANR5L17PO12345", meta },
        ];

        expect(mapEntityToGroupeActivityDetailsDTO(entities)[0].meta).toBe(meta);
    });
});

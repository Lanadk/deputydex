import { mapEntityToGroupeActivityDetailsDTO } from "@/app/domains/groupes/mappers/groupe-activity-details.mapper";
import { GroupeActivityDetailsEntity } from "@/app/domains/groupes/entities/groupe-activity-details.entity";

const NO_LINK = { scrutin_numero: null, dossier_uid: null, dossier_titre: null, dossier_legislature: null };

describe("mapEntityToGroupeActivityDetailsDTO", () => {
    it("formats the date as yyyy-mm-dd and renames ref_id to refId", () => {
        const entities: GroupeActivityDetailsEntity[] = [
            { ...NO_LINK, activity_date: new Date("2024-07-08"), domain: "vote", ref_id: "VTANR5L17V1", meta: { type: "vote" } },
        ];

        expect(mapEntityToGroupeActivityDetailsDTO(entities, 17)).toMatchObject([
            { date: "2024-07-08", domain: "vote", refId: "VTANR5L17V1", meta: { type: "vote" } },
        ]);
    });

    it("maps an empty list to an empty list", () => {
        expect(mapEntityToGroupeActivityDetailsDTO([], 17)).toEqual([]);
    });

    it("passes the meta object through untouched, whatever its shape", () => {
        const meta = { type: "amendement", sort: "adopte", extra: 42 };
        const entities: GroupeActivityDetailsEntity[] = [
            { ...NO_LINK, activity_date: new Date("2024-07-08"), domain: "amendement", ref_id: "AMANR5L17PO12345", meta },
        ];

        expect(mapEntityToGroupeActivityDetailsDTO(entities, 17)[0].meta).toBe(meta);
    });

    it("links a scrutin of the groupe to its AN page, and to its dossier when known", () => {
        const entities: GroupeActivityDetailsEntity[] = [{
            activity_date: new Date("2025-11-18"),
            domain: "scrutin",
            ref_id: "VTANR5L17V3877",
            meta: { type: "scrutin" },
            scrutin_numero: "3877",
            dossier_uid: "DLR5L17N52100",
            dossier_titre: "Projet de loi de finances de fin de gestion pour 2025",
            dossier_legislature: 17,
        }];

        expect(mapEntityToGroupeActivityDetailsDTO(entities, 17)[0]).toMatchObject({
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/scrutins/3877",
            dossier: {
                uid: "DLR5L17N52100",
                titre: "Projet de loi de finances de fin de gestion pour 2025",
                lienAN: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N52100",
            },
        });
    });
});

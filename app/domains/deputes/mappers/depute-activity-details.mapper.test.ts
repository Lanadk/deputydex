import { mapEntityToDeputeActivityDetailsDTO } from "@/app/domains/deputes/mappers/depute-activity-details.mapper";
import { DeputeActivityDetailsEntity } from "@/app/domains/deputes/entities/depute-activity-details.entity";

const NO_LINK = { scrutin_numero: null, dossier_uid: null, dossier_titre: null, dossier_legislature: null };

describe("mapEntityToDeputeActivityDetailsDTO", () => {
    it("links a deposited amendment to its page and to its dossier législatif on the AN site", () => {
        const entities: DeputeActivityDetailsEntity[] = [{
            ...NO_LINK,
            activity_date: new Date("2025-11-18"),
            domain: "amendement",
            ref_id: "AMANR5L17PO59048B1906P0D1N002834",
            meta: { type: "amendement", numero: "II-2834" },
            dossier_uid: "DLR5L17N51520",
            dossier_titre: "Projet de loi de finances pour 2026",
            dossier_legislature: 17,
        }];

        expect(mapEntityToDeputeActivityDetailsDTO(entities, 17)).toEqual([{
            date: "2025-11-18",
            domain: "amendement",
            refId: "AMANR5L17PO59048B1906P0D1N002834",
            meta: { type: "amendement", numero: "II-2834" },
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO59048B1906P0D1N002834",
            dossier: {
                uid: "DLR5L17N51520",
                titre: "Projet de loi de finances pour 2026",
                lienAN: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N51520",
            },
        }]);
    });

    it("links a vote to its scrutin, without a dossier when the scrutin is not attached to one", () => {
        const entities: DeputeActivityDetailsEntity[] = [{
            ...NO_LINK,
            activity_date: new Date("2025-11-18"),
            domain: "vote",
            ref_id: "VTANR5L17V3878",
            meta: { type: "vote", position: "contre" },
            scrutin_numero: "3878",
        }];

        const [dto] = mapEntityToDeputeActivityDetailsDTO(entities, 17);

        expect(dto.lienAN).toBe("https://www.assemblee-nationale.fr/dyn/17/scrutins/3878");
        expect(dto.dossier).toBeNull();
    });

    it("keeps the dossier of a texte opened in an earlier legislature on that legislature's AN page", () => {
        const entities: DeputeActivityDetailsEntity[] = [{
            ...NO_LINK,
            activity_date: new Date("2024-10-15"),
            domain: "amendement_co",
            ref_id: "AMANR5L17PO1N1",
            meta: { type: "amendement_co" },
            dossier_uid: "DLR5L16N47000",
            dossier_titre: "Fin de vie",
            dossier_legislature: 16,
        }];

        expect(mapEntityToDeputeActivityDetailsDTO(entities, 17)[0].dossier?.lienAN)
            .toBe("https://www.assemblee-nationale.fr/dyn/16/dossiers/DLR5L16N47000");
    });
});

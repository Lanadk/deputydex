import { mapDeputeDossierAmendementEntityToDTO } from "@/app/domains/deputes/mappers/depute-dossier-amendement.mapper";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";

const baseEntity: DeputeDossierAmendementEntity = {
    uid: "AMANR5L17PO838901B2790P0D1N000005",
    legislature_snapshot: 17,
    numero_long: "5 (Rect)",
    division_titre: "Article PREMIER",
    sort: "Adopté",
    etat_libelle: "Discuté",
    date_depot: new Date("2026-06-22T00:00:00.000Z"),
    expose_sommaire: "<p>Par cet amendement d&#x2019;appel.</p>",
};

describe("mapDeputeDossierAmendementEntityToDTO", () => {
    it("maps an examined amendment with its sort and a plain-text exposé", () => {
        expect(mapDeputeDossierAmendementEntityToDTO(baseEntity)).toEqual({
            uid: "AMANR5L17PO838901B2790P0D1N000005",
            numero: "5 (Rect)",
            division: "Article PREMIER",
            statut: "Adopté",
            isAdopte: true,
            dateDepot: "2026-06-22T00:00:00.000Z",
            exposeSommaire: "Par cet amendement d’appel.",
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO838901B2790P0D1N000005",
        });
    });

    it("falls back to the état when the amendment has no sort yet", () => {
        const dto = mapDeputeDossierAmendementEntityToDTO({ ...baseEntity, sort: "", etat_libelle: "Irrecevable" });
        expect(dto.statut).toBe("Irrecevable");
        expect(dto.isAdopte).toBe(false);
    });

    it("returns null for an empty or missing exposé", () => {
        expect(mapDeputeDossierAmendementEntityToDTO({ ...baseEntity, expose_sommaire: null }).exposeSommaire).toBeNull();
        expect(mapDeputeDossierAmendementEntityToDTO({ ...baseEntity, expose_sommaire: "<p> </p>" }).exposeSommaire).toBeNull();
    });
});

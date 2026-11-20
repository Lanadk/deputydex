import { mapDeputeDossierAmendementEntityToDTO } from "@/app/domains/deputes/mappers/depute-dossier-amendement.mapper";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";

const baseEntity: DeputeDossierAmendementEntity = {
    uid: "AMANR5L17PO59048B1906P0D1N000012",
    legislature_snapshot: 17,
    numero_long: "I-12",
    division_titre: "Article 3",
    sort: "Adopté",
    etat_libelle: "Discuté",
    date_depot: new Date("2025-10-15T00:00:00.000Z"),
    expose_sommaire: "<p>Par cet amendement d&#x2019;appel.</p>",
    texte_uid: "PRJLANR5L17B1906",
    texte_type: "Projet de loi",
    texte_numero: "1906",
    texte_etape: "AN1",
};

describe("mapDeputeDossierAmendementEntityToDTO", () => {
    it("maps an examined amendment with its sort, its texte and a plain-text exposé", () => {
        expect(mapDeputeDossierAmendementEntityToDTO(baseEntity)).toEqual({
            uid: "AMANR5L17PO59048B1906P0D1N000012",
            numero: "I-12",
            division: "Article 3",
            statut: "Adopté",
            isAdopte: true,
            dateDepot: "2025-10-15T00:00:00.000Z",
            exposeSommaire: "Par cet amendement d’appel.",
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO59048B1906P0D1N000012",
            texte: {
                uid: "PRJLANR5L17B1906",
                libelle: "Projet de loi n° 1906 · 1ère lecture AN",
            },
        });
    });

    it("labels a commission's texte as such when its étape is unknown", () => {
        const dto = mapDeputeDossierAmendementEntityToDTO({
            ...baseEntity,
            texte_uid: "PIONANR5L17BTC0475",
            texte_type: "Proposition de loi",
            texte_numero: "475",
            texte_etape: null,
        });
        expect(dto.texte.libelle).toBe("Proposition de loi n° 475 · texte de la commission");
    });

    it("falls back to the bare texte when neither type, number nor étape are known", () => {
        const dto = mapDeputeDossierAmendementEntityToDTO({
            ...baseEntity,
            texte_uid: "XYZ",
            texte_type: null,
            texte_numero: null,
            texte_etape: null,
        });
        expect(dto.texte.libelle).toBe("Texte");
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

import { mapDeputeDossierContributionEntityToDTO } from "@/app/domains/deputes/mappers/depute-dossier-contribution.mapper";
import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";

const baseEntity: DeputeDossierContributionEntity = {
    dossier_uid: "DLR5L17N50198",
    dossier_titre: "Projet de loi de finances pour 2025",
    dossier_legislature: 17,
    procedure_libelle: "Projet de loi de finances de l'année",
    nb_deposes: BigInt(65),
    nb_adoptes: BigInt(15),
    nb_cosignes: BigInt(2375),
    is_auteur_texte: false,
    is_cosignataire_texte: false,
    rapporteurs: [{ type: "rapporteur pour avis", etape: "AN1" }],
    derniere_activite: new Date("2024-11-12T00:00:00.000Z"),
};

describe("mapDeputeDossierContributionEntityToDTO", () => {
    it("converts counters to numbers, dates to ISO and names each rapporteur's étape", () => {
        expect(mapDeputeDossierContributionEntityToDTO(baseEntity)).toEqual({
            dossierUid: "DLR5L17N50198",
            titre: "Projet de loi de finances pour 2025",
            procedure: "Projet de loi de finances de l'année",
            nbDeposes: 65,
            nbAdoptes: 15,
            nbCosignes: 2375,
            isAuteurTexte: false,
            isCosignataireTexte: false,
            rapporteurs: [{ type: "rapporteur pour avis", etape: "1ère lecture AN" }],
            derniereActivite: "2024-11-12T00:00:00.000Z",
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N50198",
        });
    });

    it("names Sénat, CMP and later readings", () => {
        const dto = mapDeputeDossierContributionEntityToDTO({
            ...baseEntity,
            rapporteurs: [
                { type: "rapporteur", etape: "SN1" },
                { type: "rapporteur", etape: "CMP" },
                { type: "rapporteur", etape: "ANNLEC" },
                { type: "rapporteur", etape: "ANLUNI" },
            ],
        });
        expect(dto.rapporteurs.map((r) => r.etape)).toEqual([
            "1ère lecture Sénat",
            "Commission mixte paritaire",
            "Nouvelle lecture AN",
            "Lecture unique AN",
        ]);
    });

    it("keeps an unknown étape code as is rather than hiding it", () => {
        const dto = mapDeputeDossierContributionEntityToDTO({ ...baseEntity, rapporteurs: [{ type: "rapporteur", etape: "XYZ9" }] });
        expect(dto.rapporteurs[0].etape).toBe("XYZ9");
    });

    it("builds the AN link from the dossier's own legislature, not the contribution's", () => {
        const dto = mapDeputeDossierContributionEntityToDTO({ ...baseEntity, dossier_uid: "DLR5L16N49868", dossier_legislature: 16 });
        expect(dto.lienAN).toBe("https://www.assemblee-nationale.fr/dyn/16/dossiers/DLR5L16N49868");
    });

    it("keeps a missing activity date as null", () => {
        expect(mapDeputeDossierContributionEntityToDTO({ ...baseEntity, derniere_activite: null }).derniereActivite).toBeNull();
    });
});

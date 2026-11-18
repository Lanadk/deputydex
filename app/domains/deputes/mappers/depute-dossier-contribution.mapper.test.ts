import { mapDeputeDossierContributionEntityToDTO } from "@/app/domains/deputes/mappers/depute-dossier-contribution.mapper";
import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";

const baseEntity: DeputeDossierContributionEntity = {
    dossier_uid: "DLR5L17N52428",
    dossier_titre: "Projet de loi de finances pour 2026",
    dossier_legislature: 17,
    procedure_libelle: "Projet de loi de finances de l'année",
    nb_deposes: BigInt(179),
    nb_adoptes: BigInt(22),
    nb_cosignes: BigInt(2111),
    is_initiateur: false,
    roles_rapporteur: ["rapporteur pour avis"],
    derniere_activite: new Date("2026-01-13T00:00:00.000Z"),
};

describe("mapDeputeDossierContributionEntityToDTO", () => {
    it("converts bigint counters to numbers and dates to ISO", () => {
        expect(mapDeputeDossierContributionEntityToDTO(baseEntity)).toEqual({
            dossierUid: "DLR5L17N52428",
            titre: "Projet de loi de finances pour 2026",
            procedure: "Projet de loi de finances de l'année",
            nbDeposes: 179,
            nbAdoptes: 22,
            nbCosignes: 2111,
            isInitiateur: false,
            rolesRapporteur: ["rapporteur pour avis"],
            derniereActivite: "2026-01-13T00:00:00.000Z",
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N52428",
        });
    });

    it("builds the AN link from the dossier's own legislature, not the contribution's", () => {
        const dto = mapDeputeDossierContributionEntityToDTO({ ...baseEntity, dossier_uid: "DLR5L16N49868", dossier_legislature: 16 });
        expect(dto.lienAN).toBe("https://www.assemblee-nationale.fr/dyn/16/dossiers/DLR5L16N49868");
    });

    it("keeps a missing activity date as null", () => {
        expect(mapDeputeDossierContributionEntityToDTO({ ...baseEntity, derniere_activite: null }).derniereActivite).toBeNull();
    });
});

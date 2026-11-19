import {
    getDeputeDossierAmendementsUseCase,
    sortDossierAmendements,
} from "@/app/domains/deputes/use-cases/get-depute-dossier-amendements.use-case";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";
import { IDeputeDossiersRepository } from "@/app/domains/deputes/repositories/IDeputeDossiersRepository";
import { isErr, isOk } from "@/app/_shared/result-pattern/result";

function amendement(uid: string, texteUid: string, date: string | null): DeputeDossierAmendementEntity {
    return {
        uid,
        legislature_snapshot: 17,
        numero_long: uid,
        division_titre: null,
        sort: null,
        etat_libelle: null,
        date_depot: date ? new Date(date) : null,
        expose_sommaire: null,
        texte_uid: texteUid,
        texte_type: "Proposition de loi",
        texte_numero: null,
        texte_etape: null,
    };
}

const uids = (entities: DeputeDossierAmendementEntity[]) => entities.map((e) => e.uid);

describe("sortDossierAmendements", () => {
    it("classe les textes par amendement le plus récent, puis les amendements du plus récent au plus ancien", () => {
        const sorted = sortDossierAmendements([
            amendement("A1", "T-ancien", "2025-05-07"),
            amendement("A2", "T-ancien", "2025-05-08"),
            amendement("B1", "T-recent", "2026-06-17"),
            amendement("C1", "T-milieu", "2026-02-11"),
            amendement("B2", "T-recent", "2026-06-16"),
        ]);
        expect(uids(sorted)).toEqual(["B1", "B2", "C1", "A2", "A1"]);
    });

    it("garde les amendements d'un même texte contigus, même si un autre texte s'intercale dans le temps", () => {
        const sorted = sortDossierAmendements([
            amendement("A1", "T1", "2025-01-01"),
            amendement("B1", "T2", "2025-02-01"),
            amendement("A2", "T1", "2025-03-01"),
        ]);
        expect(uids(sorted)).toEqual(["A2", "A1", "B1"]);
    });

    it("place les amendements sans date en dernier et départage les égalités par uid décroissant", () => {
        const sorted = sortDossierAmendements([
            amendement("A1", "T1", null),
            amendement("A2", "T1", "2025-01-01"),
            amendement("A3", "T1", "2025-01-01"),
        ]);
        expect(uids(sorted)).toEqual(["A3", "A2", "A1"]);
    });
});

describe("getDeputeDossierAmendementsUseCase", () => {
    const repository = (rows: DeputeDossierAmendementEntity[] | Error): IDeputeDossiersRepository => ({
        getDeputeDossierContributions: jest.fn(),
        getDeputeDossierAmendements: jest.fn(() => (rows instanceof Error ? Promise.reject(rows) : Promise.resolve(rows))),
    });

    it("renvoie les DTO dans l'ordre d'affichage", async () => {
        const result = await getDeputeDossierAmendementsUseCase(
            repository([amendement("A1", "T1", "2025-01-01"), amendement("A2", "T1", "2025-02-01")]),
            "PA1",
            17,
            "DL1"
        );
        expect(isOk(result) && result.data.map((d) => d.uid)).toEqual(["A2", "A1"]);
    });

    it("renvoie une erreur si le repository échoue", async () => {
        const result = await getDeputeDossierAmendementsUseCase(repository(new Error("boom")), "PA1", 17, "DL1");
        expect(isErr(result)).toBe(true);
    });
});

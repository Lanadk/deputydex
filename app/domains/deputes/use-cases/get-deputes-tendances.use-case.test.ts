import { deputeEnTete, getDeputesTendancesUseCase } from "@/app/domains/deputes/use-cases/get-deputes-tendances.use-case";
import { DeputeTendanceEntity } from "@/app/domains/deputes/entities/deputes-tendances.entity";
import { IDeputesTendancesRepository } from "@/app/domains/deputes/repositories/IDeputesTendancesRepository";
import { DeputeTendanceLigneDTO } from "@/app/domains/deputes/dto/deputes-tendances.dto";

const ligne = (nom: string, votesExprimes: number, votesRebelles = 0, amendementsDeposes = 0): DeputeTendanceLigneDTO => ({
    depute: { deputeUID: nom, deputeFullName: nom, deputeGroupeCode: "RN", deputeImage: "" },
    votesExprimes,
    votesRebelles,
    amendementsDeposes,
});

const entity = (uid: string, votes: number, rebelles: number, amendements: number): DeputeTendanceEntity => ({
    depute_uid: uid,
    depute_full_name: `Député ${uid}`,
    depute_groupe_code: "EPR",
    depute_image: `/img/${uid}.png`,
    depute_role: null,
    periode_debut: new Date("2026-10-21T00:00:00Z"),
    periode_fin: new Date("2026-11-19T00:00:00Z"),
    scrutins_periode: 1134,
    votes_exprimes: votes,
    votes_rebelles: rebelles,
    amendements_deposes: amendements,
});

const repository = (rows: DeputeTendanceEntity[] | Error): IDeputesTendancesRepository => ({
    getDeputesTendances: jest.fn(() => (rows instanceof Error ? Promise.reject(rows) : Promise.resolve(rows))),
});

describe("deputeEnTete", () => {
    it("la plus grande valeur ; à égalité, l'ordre alphabétique du nom", () => {
        expect(deputeEnTete([ligne("Zoé", 10), ligne("Ana", 12), ligne("Bob", 12)], "votesExprimes"))
            .toEqual({ depute: ligne("Ana", 12).depute, valeur: 12 });
    });

    it("personne en tête si toutes les valeurs sont nulles", () => {
        expect(deputeEnTete([ligne("Ana", 5, 0)], "votesRebelles")).toBeNull();
        expect(deputeEnTete([], "votesExprimes")).toBeNull();
    });
});

describe("getDeputesTendancesUseCase", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.restoreAllMocks());

    it("période, nombre de scrutins et un député en tête par classement", async () => {
        const result = await getDeputesTendancesUseCase(repository([
            entity("A", 950, 3, 10),
            entity("B", 850, 212, 2),
            entity("C", 100, 0, 253),
        ]), 17);

        expect(result).toEqual({
            success: true,
            data: {
                periode: { debut: "2026-10-21", fin: "2026-11-19" },
                scrutins: 1134,
                assidu: expect.objectContaining({ valeur: 950, depute: expect.objectContaining({ deputeUID: "A" }) }),
                rebelle: expect.objectContaining({ valeur: 212, depute: expect.objectContaining({ deputeUID: "B" }) }),
                amendements: expect.objectContaining({ valeur: 253, depute: expect.objectContaining({ deputeUID: "C" }) }),
            },
        });
    });

    it("aucune activité : classements vides, pas une erreur", async () => {
        await expect(getDeputesTendancesUseCase(repository([]), 17)).resolves.toEqual({
            success: true,
            data: { periode: null, scrutins: 0, assidu: null, rebelle: null, amendements: null },
        });
    });

    it("erreur de base : DB_ERROR", async () => {
        await expect(getDeputesTendancesUseCase(repository(new Error("down")), 17)).resolves.toEqual({ success: false, error: "DB_ERROR" });
    });
});

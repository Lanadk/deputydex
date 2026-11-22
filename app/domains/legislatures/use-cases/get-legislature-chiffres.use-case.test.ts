import { getLegislatureChiffresUseCase } from "@/app/domains/legislatures/use-cases/get-legislature-chiffres.use-case";
import { makeRepository } from "@/app/domains/legislatures/use-cases/legislature-organisation.test-helpers";

const AUJOURDHUI = "2026-11-22";

describe("getLegislatureChiffresUseCase", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.restoreAllMocks());

    it("16ᵉ : durée, scrutins, gouvernements, entrées en cours de législature triées", async () => {
        const repository = makeRepository({
            getChiffres: jest.fn().mockResolvedValue({ scrutins: 4106, deputes_ayant_siege: 618 }),
            getEntreesEnCours: jest.fn().mockResolvedValue([
                { cause: "élection partielle", nombre: 4 },
                { cause: "remplacement d'un député nommé au Gouvernement", nombre: 33 },
            ]),
        });

        const result = await getLegislatureChiffresUseCase(repository, 16, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        expect(result.data).toMatchObject({
            legislature: 16,
            dureeJours: 712,
            scrutins: 4106,
            deputesAyantSiege: 618,
            gouvernements: 2,
            entreesEnCours: 37,
        });
        expect(result.data.entreesParCause.map((e) => e.nombre)).toEqual([33, 4]);
    });

    it("17ᵉ en cours : durée jusqu'à aujourd'hui", async () => {
        const result = await getLegislatureChiffresUseCase(makeRepository(), 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        expect(result.data).toMatchObject({ fin: null, dureeJours: 857, gouvernements: 4, scrutins: 0 });
    });

    it("NOT_FOUND pour une législature inconnue", async () => {
        expect(await getLegislatureChiffresUseCase(makeRepository(), 99, AUJOURDHUI)).toEqual({ success: false, error: "NOT_FOUND" });
    });
});

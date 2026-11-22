import { getPresidenceAssembleeUseCase, presidenceEnPlace } from "@/app/domains/legislatures/use-cases/get-presidence-assemblee.use-case";
import { IPresidenceAssembleeRepository } from "@/app/domains/legislatures/repositories/IPresidenceAssembleeRepository";
import { PresidenceAssembleeEntity } from "@/app/domains/legislatures/entities/presidence-assemblee.entity";

const mandat = (acteur_uid: string, nom: string, debut: string, fin: string | null = null): PresidenceAssembleeEntity =>
    ({ acteur_uid, prenom: "P.", nom, debut, fin });

const repository = (mandats: PresidenceAssembleeEntity[] | Error): IPresidenceAssembleeRepository => ({
    getPresidencesAssemblee: mandats instanceof Error ? jest.fn().mockRejectedValue(mandats) : jest.fn().mockResolvedValue(mandats),
});

describe("presidenceEnPlace", () => {
    it("le mandat en cours, même s'il n'est pas le plus récent dans l'ordre reçu", () => {
        expect(presidenceEnPlace([mandat("PA2", "Ferrand", "2018-09-12"), mandat("PA1", "Rugy", "2017-06-27", "2018-09-04")])?.acteur_uid)
            .toBe("PA2");
    });

    it("législature close : le mandat le plus récent", () => {
        expect(presidenceEnPlace([mandat("PA1", "Rugy", "2017-06-27", "2018-09-04"), mandat("PA2", "Ferrand", "2018-09-12", "2022-06-21")])?.acteur_uid)
            .toBe("PA2");
    });

    it("aucun mandat : null", () => {
        expect(presidenceEnPlace([])).toBeNull();
    });
});

describe("getPresidenceAssembleeUseCase", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.restoreAllMocks());

    it("renvoie la présidence en place, nom complet", async () => {
        const repo = repository([mandat("PA_YBP", "Braun-Pivet", "2024-07-18")]);

        expect(await getPresidenceAssembleeUseCase(repo, 17)).toEqual({
            success: true,
            data: { uid: "PA_YBP", nom: "P. Braun-Pivet", depuis: "2024-07-18", jusqua: null },
        });
        expect(repo.getPresidencesAssemblee).toHaveBeenCalledWith(17);
    });

    it("NOT_FOUND sans mandat de président", async () => {
        expect(await getPresidenceAssembleeUseCase(repository([]), 17)).toEqual({ success: false, error: "NOT_FOUND" });
    });

    it("DB_ERROR si le repository échoue", async () => {
        expect(await getPresidenceAssembleeUseCase(repository(new Error("down")), 17)).toEqual({ success: false, error: "DB_ERROR" });
    });
});

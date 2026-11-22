import { getLegislaturesFriseUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-frise.use-case";
import { makeRepository } from "@/app/domains/legislatures/use-cases/legislature-organisation.test-helpers";

const AUJOURDHUI = "2026-11-22";

describe("getLegislaturesFriseUseCase", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.restoreAllMocks());

    it("couvre du premier gouvernement des législatures à aujourd'hui, avec les quatre couloirs", async () => {
        const repository = makeRepository({
            getPresidentsAssemblee: jest.fn().mockResolvedValue([
                { legislature: 17, acteur_uid: "PA_YBP", prenom: "Yaël", nom: "Braun-Pivet", debut: "2024-07-18", fin: null },
                { legislature: 16, acteur_uid: "PA_YBP", prenom: "Yaël", nom: "Braun-Pivet", debut: "2022-06-28", fin: "2024-06-09" },
            ]),
        });

        const result = await getLegislaturesFriseUseCase(repository, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        const frise = result.data;
        // Le gouvernement Borne (mai 2022) précède la 16ᵉ législature (juin 2022).
        expect([frise.debut, frise.fin]).toEqual(["2022-05-17", AUJOURDHUI]);
        expect(frise.couloirs.map((c) => c.id)).toEqual(["presidence", "legislatures", "gouvernements", "assemblee"]);

        const [presidence, legislatures, gouvernements, assemblee] = frise.couloirs;
        // Le 1er mandat (fini le 13/05/2022) ne chevauche pas la frise (qui commence le 17/05/2022).
        expect(presidence.periodes.map((p) => [p.libelle, p.detail])).toEqual([["Emmanuel Macron", "2e mandat"]]);
        expect(legislatures.periodes.map((p) => p.libelle)).toEqual(["16ᵉ législature", "17ᵉ législature"]);
        expect(gouvernements.periodes.map((p) => p.libelle)).toEqual([
            "Gouvernement Borne", "Gouvernement Attal", "Gouvernement Barnier", "Gouvernement Lecornu I", "Gouvernement Lecornu II",
        ]);
        // Triée chronologiquement, avec un lien vers la fiche.
        expect(assemblee.periodes.map((p) => [p.debut, p.href])).toEqual([
            ["2022-06-28", "/deputes/PA_YBP"],
            ["2024-07-18", "/deputes/PA_YBP"],
        ]);
        expect(frise.evenements.map((e) => e.libelle)).toContain("Dissolution de l'Assemblée");
    });

    it("DB_ERROR si le repository échoue", async () => {
        const repository = makeRepository({ getLegislatures: jest.fn().mockRejectedValue(new Error("down")) });

        expect(await getLegislaturesFriseUseCase(repository, AUJOURDHUI)).toEqual({ success: false, error: "DB_ERROR" });
    });
});

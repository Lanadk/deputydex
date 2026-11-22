import { chevauche, contient, finParDissolution, joursEntre, libelleLegislature, libelleMandat, nommerGouvernements } from "@/app/domains/legislatures/institutions";

describe("institutions — règles de dates", () => {
    it("chevauche : une période en cours (fin null) chevauche tout ce qui suit son début", () => {
        expect(chevauche("2024-07-18", null, "2025-01-01", "2026-01-01")).toBe(true);
        expect(chevauche("2022-05-17", "2024-01-08", "2022-06-28", "2024-06-09")).toBe(true);
        expect(chevauche("2024-09-05", "2024-12-12", "2022-06-28", "2024-06-09")).toBe(false);
    });

    it("contient : bornes incluses", () => {
        expect(contient("2024-01-09", "2024-09-04", "2024-09-04")).toBe(true);
        expect(contient("2024-01-09", "2024-09-04", "2024-09-05")).toBe(false);
        expect(contient("2024-01-09", null, "2030-01-01")).toBe(true);
    });

    it("joursEntre : nombre de jours entre deux dates", () => {
        expect(joursEntre("2022-06-28", "2024-06-09")).toBe(712);
        expect(joursEntre("2025-09-09", "2025-10-09")).toBe(30);
    });

    it("libelleLegislature : ordinal", () => {
        expect(libelleLegislature(17)).toBe("17ᵉ législature");
        expect(libelleLegislature(1)).toBe("1ʳᵉ législature");
    });

    it("libelleMandat : 1er, 2e", () => {
        expect(libelleMandat(1)).toBe("1er mandat");
        expect(libelleMandat(2)).toBe("2e mandat");
    });
});

describe("finParDissolution", () => {
    const EVENEMENTS = [
        { date: "2022-06-19", type: "elections_legislatives" },
        { date: "2024-06-09", type: "dissolution" },
    ];

    it("vraie si une dissolution tombe dans la période (le dernier jour compris)", () => {
        expect(finParDissolution({ debut: "2022-06-28", fin: "2024-06-09" }, EVENEMENTS)).toBe(true);
    });

    it("fausse pour une législature en cours, ou close sans dissolution", () => {
        expect(finParDissolution({ debut: "2024-07-18", fin: null }, EVENEMENTS)).toBe(false);
        expect(finParDissolution({ debut: "2017-06-21", fin: "2022-06-21" }, EVENEMENTS)).toBe(false);
    });

    it("ignore les autres types d'événements", () => {
        expect(finParDissolution({ debut: "2022-06-01", fin: "2022-06-30" }, EVENEMENTS)).toBe(false);
    });
});

describe("nommerGouvernements", () => {
    const pm = (acteur_uid: string, nom: string) => ({ acteur_uid, nom });

    it("nomme chaque gouvernement d'après son Premier ministre", () => {
        expect(nommerGouvernements([pm("PA1", "Borne"), pm("PA2", "Attal")]).map((g) => g.libelle))
            .toEqual(["Gouvernement Borne", "Gouvernement Attal"]);
    });

    it("numérote les gouvernements consécutifs d'un même Premier ministre", () => {
        expect(nommerGouvernements([pm("PA3", "Bayrou"), pm("PA4", "Lecornu"), pm("PA4", "Lecornu")]).map((g) => g.libelle))
            .toEqual(["Gouvernement Bayrou", "Gouvernement Lecornu I", "Gouvernement Lecornu II"]);
    });

    it("ne numérote pas deux gouvernements non consécutifs d'un même Premier ministre ensemble", () => {
        expect(nommerGouvernements([pm("PA1", "Martin"), pm("PA2", "Durand"), pm("PA1", "Martin")]).map((g) => g.libelle))
            .toEqual(["Gouvernement Martin", "Gouvernement Durand", "Gouvernement Martin"]);
    });
});

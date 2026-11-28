import { estToutesLegislatures, lirePerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";

describe("lirePerimetreLegislature", () => {
    it("accepte un numéro de législature ou « toutes »", () => {
        expect(lirePerimetreLegislature(17)).toBe(17);
        expect(lirePerimetreLegislature(18)).toBe(18);
        expect(lirePerimetreLegislature(TOUTES_LEGISLATURES)).toBe("toutes");
    });

    it("rejette le reste (absent, texte, non entier, négatif)", () => {
        for (const v of [undefined, null, "17", 17.5, 0, -1, "Toutes"]) expect(lirePerimetreLegislature(v)).toBeUndefined();
    });

    it("estToutesLegislatures", () => {
        expect(estToutesLegislatures("toutes")).toBe(true);
        expect(estToutesLegislatures(17)).toBe(false);
    });
});

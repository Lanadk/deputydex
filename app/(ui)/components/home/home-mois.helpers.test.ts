import {
    jourCourt,
    periodeCourte,
    phraseEcart,
    uniteAmendements,
    uniteAssidu,
    uniteRebelle,
} from "@/app/(ui)/components/home/home-mois.helpers";

describe("home-mois.helpers", () => {
    it("période et date courtes", () => {
        expect(periodeCourte({ debut: "2026-10-21", fin: "2026-11-19" })).toBe("21 oct. → 19 nov. 2026");
        expect(jourCourt("2026-11-18T00:00:00.000Z")).toBe("18 nov. 2026");
    });

    it("écart d'un scrutin serré : égalité, puis « voix » invariable", () => {
        expect(phraseEcart(false, 0)).toBe("Rejeté à égalité parfaite");
        expect(phraseEcart(true, 1)).toBe("Adopté à 1 voix près");
        expect(phraseEcart(false, 3)).toBe("Rejeté à 3 voix près");
    });

    it("unités sous les grands chiffres (singulier / pluriel)", () => {
        expect(uniteAssidu(950, 1134)).toMatch(/^scrutins sur 1\s134$/);
        expect(uniteAssidu(1, 3)).toBe("scrutin sur 3");
        expect(uniteRebelle(1)).toBe("vote contre son groupe");
        expect(uniteRebelle(212)).toBe("votes contre son groupe");
        expect(uniteAmendements(1)).toBe("amendement déposé");
        expect(uniteAmendements(253)).toBe("amendements déposés");
    });
});

import { hemicycleSeatColor, votePositionColor } from "@/app/(ui)/_shared/adapter/vote-position.adapter";

describe("votePositionColor (tableaux, barres, textes)", () => {
    it("utilise les tokens de vote du design system", () => {
        expect(votePositionColor("pour")).toBe("var(--vote-pour)");
        expect(votePositionColor("contre")).toBe("var(--vote-contre)");
        expect(votePositionColor("abstention")).toBe("var(--vote-abstention)");
    });

    it("colore les non-votants, stockés « non_votant » en base, et les absents", () => {
        expect(votePositionColor("non_votant")).toBe("var(--vote-non-votant)");
        expect(votePositionColor("absent")).toBe("var(--vote-absent)");
    });

    it("ne renvoie rien sans position ou pour une position inconnue", () => {
        expect(votePositionColor(null)).toBeUndefined();
        expect(votePositionColor("inconnue")).toBeUndefined();
    });
});

describe("hemicycleSeatColor (sièges de l'hémicycle)", () => {
    it("utilise les tokens propres à l'hémicycle pour les positions exprimées", () => {
        expect(hemicycleSeatColor("pour")).toBe("var(--vote-hemicycle-pour)");
        expect(hemicycleSeatColor("contre")).toBe("var(--vote-hemicycle-contre)");
        expect(hemicycleSeatColor("abstention")).toBe("var(--vote-hemicycle-abstention)");
    });

    it("partage les gris des tableaux pour les non-votants et les absents", () => {
        expect(hemicycleSeatColor("absent")).toBe("var(--vote-absent)");
        expect(hemicycleSeatColor("non_votant")).toBe("var(--vote-non-votant)");
    });
});

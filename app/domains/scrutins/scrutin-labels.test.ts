import { resultatLibelle, scrutinObjetLabel } from "@/app/domains/scrutins/scrutin-labels";

describe("resultatLibelle", () => {
    it("traduit le code de résultat de l'open data", () => {
        expect(resultatLibelle("adopté")).toBe("Adopté");
        expect(resultatLibelle("rejeté")).toBe("Rejeté");
    });

    it("n'invente pas de résultat quand il manque", () => {
        expect(resultatLibelle(null)).toBeNull();
    });
});

describe("scrutinObjetLabel", () => {
    it("traduit les objets connus et garde un objet inconnu tel quel", () => {
        expect(scrutinObjetLabel("ensemble")).toBe("Ensemble du texte");
        expect(scrutinObjetLabel("inconnu")).toBe("inconnu");
    });
});

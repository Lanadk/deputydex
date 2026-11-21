import { htmlToPlainText, normalizeForSearch } from "@/app/_shared/utils/string";

describe("normalizeForSearch", () => {
    it("strips accents", () => {
        expect(normalizeForSearch("Élie")).toBe("elie");
    });

    it("lowercases the value", () => {
        expect(normalizeForSearch("CÉSAR")).toBe("cesar");
    });

    it("trims surrounding whitespace", () => {
        expect(normalizeForSearch("  César  ")).toBe("cesar");
    });

    it("returns an empty string unchanged", () => {
        expect(normalizeForSearch("")).toBe("");
    });

    it("leaves a string with no diacritics unchanged (aside from casing)", () => {
        expect(normalizeForSearch("Martin")).toBe("martin");
    });

    it("turns the typographic apostrophe into a straight one", () => {
        expect(normalizeForSearch("L’ensemble")).toBe("l'ensemble");
    });

    it("collapses inner whitespace", () => {
        expect(normalizeForSearch("Sécurité   sociale")).toBe("securite sociale");
    });
});

describe("htmlToPlainText", () => {
    it("strips tags and decodes hex numeric entities", () => {
        expect(htmlToPlainText("<p>Par cet amendement d&#x2019;appel</p>")).toBe("Par cet amendement d’appel");
    });

    it("decodes decimal and named entities", () => {
        expect(htmlToPlainText("A &amp; B &#233;t&#233; &nbsp;C")).toBe("A & B été C");
    });

    it("keeps paragraphs separated by a single space", () => {
        expect(htmlToPlainText("<p>Un.</p><p>Deux.</p>")).toBe("Un. Deux.");
    });

    it("leaves unknown named entities untouched", () => {
        expect(htmlToPlainText("&foo;")).toBe("&foo;");
    });

    it("keeps an unclosed « < » as text and still strips the tags that follow", () => {
        expect(htmlToPlainText("a < b <p>c</p>")).toBe("a < b c");
    });

    it("stays fast on a long text full of unclosed « < »", () => {
        const start = performance.now();
        htmlToPlainText("<".repeat(50_000) + "x");
        // Linéaire : quelques ms ; l'ancienne regex (<[^>]*>) mettait ~1 s ici.
        expect(performance.now() - start).toBeLessThan(200);
    });
});

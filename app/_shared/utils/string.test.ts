import { normalizeForSearch } from "@/app/_shared/utils/string";

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
});

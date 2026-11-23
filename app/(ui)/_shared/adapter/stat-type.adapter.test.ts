import { TYPES_STAT, typeStatCouleur, typeStatEncre } from "@/app/(ui)/_shared/adapter/stat-type.adapter";

describe("stat-type.adapter", () => {
    it("chaque type donne son accent et son encre (variables du design system)", () => {
        expect(TYPES_STAT.map(typeStatCouleur)).toEqual(["var(--stat-type-blanc)", "var(--stat-type-rouge)", "var(--stat-type-bleu)"]);
        expect(typeStatEncre("rouge")).toBe("var(--stat-type-rouge-ink)");
    });
});

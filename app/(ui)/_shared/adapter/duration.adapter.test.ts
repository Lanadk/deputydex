import { durationColor } from "@/app/(ui)/_shared/adapter/duration.adapter";

describe("durationColor", () => {
    it("laisse la couleur du texte sous 100 ms", () => {
        expect(durationColor(0)).toBeUndefined();
        expect(durationColor(99.9)).toBeUndefined();
    });

    it("passe en orange de 100 à 200 ms inclus", () => {
        expect(durationColor(100)).toBe("var(--ui-warning)");
        expect(durationColor(150)).toBe("var(--ui-warning)");
        expect(durationColor(200)).toBe("var(--ui-warning)");
    });

    it("passe en rouge au-delà de 200 ms", () => {
        expect(durationColor(200.1)).toBe("var(--ui-danger)");
        expect(durationColor(1500)).toBe("var(--ui-danger)");
    });
});

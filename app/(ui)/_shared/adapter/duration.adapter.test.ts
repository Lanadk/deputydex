import { deltaColor, durationColor, renderDurationColor } from "@/app/(ui)/_shared/adapter/duration.adapter";

describe("renderDurationColor", () => {
    it("orange au-delà d'une image (16 ms), rouge à partir d'une tâche longue (50 ms)", () => {
        expect(renderDurationColor(15.9)).toBeUndefined();
        expect(renderDurationColor(16)).toBe("var(--ui-warning)");
        expect(renderDurationColor(49.9)).toBe("var(--ui-warning)");
        expect(renderDurationColor(50)).toBe("var(--ui-danger)");
    });
});

describe("deltaColor", () => {
    it("vert si plus rapide, rouge si plus lent, rien dans le bruit, grisé si trop peu de mesures", () => {
        expect(deltaColor("faster")).toBe("var(--ui-success)");
        expect(deltaColor("slower")).toBe("var(--ui-danger)");
        expect(deltaColor("same")).toBeUndefined();
        expect(deltaColor("uncertain")).toBe("var(--subtitle-accent)");
        expect(deltaColor(undefined)).toBeUndefined();
    });
});

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

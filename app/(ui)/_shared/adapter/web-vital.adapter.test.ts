import { formatWebVital, webVitalColor } from "@/app/(ui)/_shared/adapter/web-vital.adapter";

describe("webVitalColor", () => {
    it("suit les seuils officiels : bon, à améliorer, mauvais", () => {
        expect(webVitalColor("LCP", 2500)).toBe("var(--ui-success)");
        expect(webVitalColor("LCP", 3000)).toBe("var(--ui-warning)");
        expect(webVitalColor("LCP", 4001)).toBe("var(--ui-danger)");
        expect(webVitalColor("INP", 150)).toBe("var(--ui-success)");
        expect(webVitalColor("INP", 600)).toBe("var(--ui-danger)");
    });

    it("traite CLS comme un score sans unité", () => {
        expect(webVitalColor("CLS", 0.05)).toBe("var(--ui-success)");
        expect(webVitalColor("CLS", 0.2)).toBe("var(--ui-warning)");
        expect(webVitalColor("CLS", 0.3)).toBe("var(--ui-danger)");
    });
});

describe("formatWebVital", () => {
    it("affiche les durées en ms ou en s, et CLS en score", () => {
        expect(formatWebVital("LCP", 340)).toBe("340 ms");
        expect(formatWebVital("LCP", 2480)).toBe("2,5 s");
        expect(formatWebVital("CLS", 0.042)).toBe("0,04");
    });
});

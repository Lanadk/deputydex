import { formatNombreFr } from "@/app/_shared/utils/number";

describe("formatNombreFr", () => {
    it("virgule décimale, nombre de décimales borné", () => {
        expect(formatNombreFr(57, { min: 1, max: 1 })).toBe("57,0");
        expect(formatNombreFr(21.64, { max: 1 })).toBe("21,6");
        expect(formatNombreFr(21, { max: 1 })).toBe("21");
    });
});

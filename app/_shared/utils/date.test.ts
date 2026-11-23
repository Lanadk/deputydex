import {
    formatDateOnlyFr,
    formatJourCourtFr,
    formatJourFr,
    formatJourLongFr,
    formatJourMoisFr,
    toISODateOnly,
} from "@/app/_shared/utils/date";

describe("formats de jour en français, sans glissement de fuseau", () => {
    it("jj/mm/aaaa, depuis un jour ou une date ISO complète", () => {
        expect(formatJourFr("2024-07-18")).toBe("18/07/2024");
        expect(formatJourFr("2024-07-18T00:00:00.000Z")).toBe("18/07/2024");
        expect(formatDateOnlyFr("2024-07-18")).toBe("18/07/2024");
        expect(formatDateOnlyFr(null)).toBeNull();
    });

    it("jour en toutes lettres", () => {
        expect(formatJourLongFr("2024-07-18")).toBe("18 juillet 2024");
        expect(formatJourLongFr("2022-06-28T00:00:00.000Z")).toBe("28 juin 2022");
    });

    it("jour avec mois abrégé, avec ou sans l'année", () => {
        expect(formatJourCourtFr("2026-11-18T00:00:00.000Z")).toBe("18 nov. 2026");
        expect(formatJourMoisFr("2026-10-21")).toBe("21 oct.");
    });
});

describe("toISODateOnly", () => {
    it("formats a Date as yyyy-mm-dd", () => {
        expect(toISODateOnly(new Date("1970-06-15T00:00:00Z"))).toBe("1970-06-15");
    });

    it("returns null for a null input", () => {
        expect(toISODateOnly(null)).toBeNull();
    });

    it("returns null for an undefined input", () => {
        expect(toISODateOnly(undefined)).toBeNull();
    });
});

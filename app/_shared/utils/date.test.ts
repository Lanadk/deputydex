import { toISODateOnly } from "@/app/_shared/utils/date";

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

import { describeDirection, formatNumber, formatPct, ratioPct } from "@/app/(ui)/(views)/(db)/statistics/_catalog/insights/phrase-helpers";

describe("formatNumber", () => {
    it("keeps integers as-is", () => {
        expect(formatNumber(46)).toBe("46");
    });

    it("rounds non-integers to 1 decimal", () => {
        expect(formatNumber(45.999)).toBe("46.0");
    });
});

describe("formatPct", () => {
    it("appends a % sign", () => {
        expect(formatPct(46)).toBe("46%");
    });
});

describe("describeDirection", () => {
    it("says 'au-dessus de' when current is higher", () => {
        expect(describeDirection(46, 35)).toBe("au-dessus de");
    });

    it("says 'en-dessous de' when current is lower", () => {
        expect(describeDirection(30, 35)).toBe("en-dessous de");
    });

    it("says 'à peu près comme' when the difference is negligible", () => {
        expect(describeDirection(35, 35.02)).toBe("à peu près comme");
    });
});

describe("ratioPct", () => {
    it("computes the percentage part represents in part+rest", () => {
        expect(ratioPct(46, 54)).toBe(46);
    });

    it("returns null when the total is zero", () => {
        expect(ratioPct(0, 0)).toBeNull();
    });
});

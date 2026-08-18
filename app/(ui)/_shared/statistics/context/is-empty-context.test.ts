import { isEmptyContext } from "@/app/(ui)/_shared/statistics/context/is-empty-context";

describe("isEmptyContext", () => {
    it("is empty with no keys at all", () => {
        expect(isEmptyContext({})).toBe(true);
    });

    it("is empty with an empty filters object", () => {
        expect(isEmptyContext({ filters: {} })).toBe(true);
    });

    it("is not empty once entityId is set", () => {
        expect(isEmptyContext({ entityId: "PA1" })).toBe(false);
    });

    it("is not empty once filters carries at least one key", () => {
        expect(isEmptyContext({ filters: { legislature: 17 } })).toBe(false);
    });
});

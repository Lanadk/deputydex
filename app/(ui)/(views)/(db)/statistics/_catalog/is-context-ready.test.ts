jest.mock("@/app/(ui)/components/statistics/entity-resolvers/entity-resolvers.registry", () => ({
    ENTITY_RESOLVERS: { acteurs: () => null, groupes: () => null },
}));

import { isContextReady } from "@/app/(ui)/(views)/(db)/statistics/_catalog/is-context-ready";

describe("isContextReady", () => {
    it("is always ready for a domain with no EntityResolver", () => {
        expect(isContextReady("votes", "aggregate", {})).toBe(true);
        expect(isContextReady("scrutins", "entity", {})).toBe(true);
    });

    describe("scope entity, with a resolver", () => {
        it("is not ready without an entityId", () => {
            expect(isContextReady("acteurs", "entity", {})).toBe(false);
        });

        it("is ready once entityId is set", () => {
            expect(isContextReady("acteurs", "entity", { entityId: "PA1" })).toBe(true);
        });
    });

    describe("scope aggregate, with a resolver", () => {
        it("is not ready without a legislature filter", () => {
            expect(isContextReady("groupes", "aggregate", {})).toBe(false);
            expect(isContextReady("groupes", "aggregate", { filters: {} })).toBe(false);
        });

        it("is ready once filters.legislature is set", () => {
            expect(isContextReady("groupes", "aggregate", { filters: { legislature: 17 } })).toBe(true);
        });
    });
});

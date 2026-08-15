import { buildContextLabel } from "@/app/(ui)/(views)/(db)/statistics/_catalog/build-context-label";

describe("buildContextLabel", () => {
    it("falls back when no domain is resolved yet", () => {
        expect(buildContextLabel(null, {}, "Contexte A")).toBe("Contexte A");
    });

    it("falls back when nothing has been chosen for a resolved domain", () => {
        expect(buildContextLabel("groupes", {}, "Contexte A")).toBe("Contexte A");
    });

    it("uses the entityLabel + legislature when an entity is picked", () => {
        const label = buildContextLabel("groupes", { entityId: "RN", filters: { entityLabel: "RN", legislature: 17 } }, "Contexte A");
        expect(label).toBe("RN — 17ᵉ législature");
    });

    it("falls back to the raw entityId when no entityLabel was provided", () => {
        const label = buildContextLabel("groupes", { entityId: "RN" }, "Contexte A");
        expect(label).toBe("RN");
    });

    it("uses the entity label alone when there is no legislature (acteurs)", () => {
        const label = buildContextLabel("acteurs", { entityId: "PA1", filters: { entityLabel: "Amélie Durand" } }, "Contexte A");
        expect(label).toBe("Amélie Durand");
    });

    it("describes an aggregate population with its legislature", () => {
        const label = buildContextLabel("groupes", { filters: { legislature: 16 } }, "Contexte A");
        expect(label).toBe("Tous les groupes — 16ᵉ législature");
    });
});

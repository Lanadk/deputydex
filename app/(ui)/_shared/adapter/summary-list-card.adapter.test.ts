import { positionToBadge } from "@/app/(ui)/_shared/adapter/summary-list-card.adapter";

describe("positionToBadge", () => {
    it("maps 'pour' to a primary badge", () => {
        expect(positionToBadge("pour")).toEqual({ badge: { text: "Pour", variant: "primary" } });
    });

    it("maps 'contre' to a secondary badge", () => {
        expect(positionToBadge("contre")).toEqual({ badge: { text: "Contre", variant: "secondary" } });
    });

    it("maps 'abstention' to a tertiary badge", () => {
        expect(positionToBadge("abstention")).toEqual({ badge: { text: "Abst.", variant: "tertiary" } });
    });

    it("maps 'non-votant' to a tertiary badge using 'value' instead of 'text'", () => {
        expect(positionToBadge("non-votant")).toEqual({
            badge: { value: "Non-votant", variant: "tertiary" },
        });
    });

    it("falls back to a plain '-' value for any unhandled position", () => {
        expect(positionToBadge("unknown-position" as any)).toEqual({ value: "-" });
    });
});

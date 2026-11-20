import { isVoteRebelle, votePositionLabel } from "@/app/domains/votes/vote-position";

describe("votePositionLabel", () => {
    it("traduit les positions de la base", () => {
        expect(votePositionLabel("pour")).toBe("Pour");
        expect(votePositionLabel("non_votant")).toBe("Non-votant");
    });

    it("renvoie telle quelle une position inconnue", () => {
        expect(votePositionLabel("inconnue")).toBe("inconnue");
    });
});

describe("isVoteRebelle", () => {
    it("est vrai quand la position exprimée diffère de celle du groupe", () => {
        expect(isVoteRebelle("contre", "pour")).toBe(true);
        expect(isVoteRebelle("abstention", "contre")).toBe(true);
    });

    it("est faux quand le député suit son groupe", () => {
        expect(isVoteRebelle("pour", "pour")).toBe(false);
    });

    it("ne considère pas un non-votant comme rebelle", () => {
        expect(isVoteRebelle("non_votant", "pour")).toBe(false);
    });

    it("est faux quand le groupe n'a pas de position majoritaire", () => {
        expect(isVoteRebelle("contre", null)).toBe(false);
    });
});

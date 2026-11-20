import { hemicycleSeatColor, votePositionColor } from "@/app/(ui)/_shared/adapter/vote-position.adapter";

describe("votePositionColor (tableaux, barres, textes)", () => {
    it("colore « pour » en vert et « contre » en rouge", () => {
        expect(votePositionColor("pour")).toBe("#22c55e");
        expect(votePositionColor("contre")).toBe("#ef4444");
    });

    it("colore les non-votants, stockés « non_votant » en base", () => {
        expect(votePositionColor("non_votant")).toBe("#64748b");
    });

    it("ne renvoie rien sans position ou pour une position inconnue", () => {
        expect(votePositionColor(null)).toBeUndefined();
        expect(votePositionColor("inconnue")).toBeUndefined();
    });
});

describe("hemicycleSeatColor (sièges de l'hémicycle)", () => {
    it("colore « pour » en bleu, pour se distinguer sur le plan 3D", () => {
        expect(hemicycleSeatColor("pour")).toBe("#2563eb");
        expect(hemicycleSeatColor("contre")).toBe("#dc2626");
        expect(hemicycleSeatColor("absent")).toBe("#d1d5db");
    });
});

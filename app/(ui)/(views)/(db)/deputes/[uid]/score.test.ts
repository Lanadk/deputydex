import { calculerScore, scoreDeputeApercu, verdictScore } from "@/app/(ui)/(views)/(db)/deputes/[uid]/score";

describe("score du député", () => {
    it("moyenne pondérée des sous-scores, arrondie", () => {
        expect(calculerScore([
            { id: "a", label: "A", description: "", poids: 60, score: 80 },
            { id: "b", label: "B", description: "", poids: 40, score: 50 },
        ])).toBe(68);
    });

    it("composante sans donnée : ignorée, son poids redistribué ; aucune donnée = null", () => {
        expect(calculerScore([
            { id: "a", label: "A", description: "", poids: 50, score: 80 },
            { id: "b", label: "B", description: "", poids: 50, score: null },
        ])).toBe(80);
        expect(calculerScore([{ id: "a", label: "A", description: "", poids: 100, score: null }])).toBeNull();
    });

    it("aperçu : marqué fictif, poids à 100 %, score cohérent avec ses composantes", () => {
        const apercu = scoreDeputeApercu();
        expect(apercu.apercu).toBe(true);
        expect(apercu.composantes.reduce((s, c) => s + c.poids, 0)).toBe(100);
        expect(apercu.score).toBe(calculerScore(apercu.composantes));
    });

    it("verdict par tranche de 20 points", () => {
        expect([95, 65, 45, 25, 5, null].map(verdictScore)).toEqual([
            "Très actif", "Actif", "Dans la moyenne", "Peu actif", "Très peu actif", "Pas assez de données",
        ]);
    });
});

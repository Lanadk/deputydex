import { grilleActivite } from "@/app/(ui)/components/home/home-activite.helpers";

describe("grilleActivite", () => {
    it("une colonne par semaine (lundi → dimanche), jusqu'au dernier jour connu", () => {
        // 2026-11-18 est un mercredi.
        const grille = grilleActivite([
            { date: "2026-11-18", count: 40, level: 4 },
            { date: "2026-11-16", count: 3, level: 1 },
            { date: "2026-11-10", count: 12, level: 3 },
        ], 2);

        expect(grille).toEqual([
            // Semaine du lundi 9 : mardi 10 au niveau 3.
            [0, 3, 0, 0, 0, 0, 0],
            // Semaine du lundi 16 : lundi niveau 1, mercredi 18 niveau 4, puis jours à venir (-1).
            [1, 0, 4, -1, -1, -1, -1],
        ]);
    });

    it("sans activité : grille vide", () => {
        expect(grilleActivite([], 20)).toEqual([]);
    });
});

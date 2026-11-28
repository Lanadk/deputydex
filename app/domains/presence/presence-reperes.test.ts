import { libelleDansEchelle, reperesLegislatures } from "@/app/domains/presence/presence-reperes";

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);
// Débuts réels des 16ᵉ et 17ᵉ (param_legislatures), et une 18ᵉ fictive : rien ne doit changer dans le code.
const DEBUTS = [
    { legislature: 17, debut: d("2024-07-18") },
    { legislature: 16, debut: d("2022-06-28") },
];
const AVEC_18 = [...DEBUTS, { legislature: 18, debut: d("2027-07-01") }];

describe("libelleDansEchelle", () => {
    it("place une date dans le format de libellé de chaque échelle", () => {
        expect(libelleDansEchelle(d("2024-07-18"), "jour")).toBe("2024-07-18");
        expect(libelleDansEchelle(d("2024-07-18"), "mois")).toBe("2024-07");
        expect(libelleDansEchelle(d("2024-07-18"), "civile")).toBe("2024");
        // Année parlementaire : 1er octobre → 30 septembre.
        expect(libelleDansEchelle(d("2024-07-18"), "parlementaire")).toBe("2023-2024");
        expect(libelleDansEchelle(d("2024-10-01"), "parlementaire")).toBe("2024-2025");
    });
});

describe("reperesLegislatures", () => {
    it("année parlementaire : repère sur l'année coupée, pas au premier point de la courbe", () => {
        const libelles = ["2021-2022", "2022-2023", "2023-2024", "2024-2025", "2025-2026"];
        expect(reperesLegislatures(DEBUTS, "parlementaire", libelles)).toEqual([
            { at: "2023-2024", label: "Début de la 17ᵉ législature" },
        ]);
    });

    it("jour : un début sans séance tombe sur la séance suivante", () => {
        const libelles = ["2024-06-04", "2024-06-05", "2024-07-19", "2024-07-23"];
        expect(reperesLegislatures(DEBUTS, "jour", libelles)).toEqual([{ at: "2024-07-19", label: "Début de la 17ᵉ législature" }]);
    });

    it("une nouvelle législature ajoute son repère d'elle-même", () => {
        const libelles = ["2022-06", "2024-07", "2026-11", "2027-07", "2027-10"];
        expect(reperesLegislatures(AVEC_18, "mois", libelles)).toEqual([
            { at: "2024-07", label: "Début de la 17ᵉ législature" },
            { at: "2027-07", label: "Début de la 18ᵉ législature" },
        ]);
    });

    it("pas de repère après la fin de la courbe, ni sur une courbe vide", () => {
        expect(reperesLegislatures(AVEC_18, "civile", ["2022", "2023", "2024", "2025"])).toEqual([
            { at: "2024", label: "Début de la 17ᵉ législature" },
        ]);
        expect(reperesLegislatures(DEBUTS, "mois", [])).toEqual([]);
    });
});

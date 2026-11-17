import {
    compareGroupesGaucheDroite,
    getGroupeRangGaucheDroite,
} from "@/app/domains/groupes/constants/groupe-ordre-hemicycle.constants";

describe("ordre gauche → droite de l'hémicycle", () => {
    it("orders the 17th legislature groups from left to right, NI last", () => {
        const codes = ["RN", "NI-17", "EPR", "LFI-NFP", "UDDPLR", "SOC", "DR", "GDR", "HOR", "ECOS", "LIOT", "DEM"];
        expect([...codes].sort(compareGroupesGaucheDroite)).toEqual([
            "LFI-NFP", "GDR", "ECOS", "SOC", "DEM", "EPR", "HOR", "LIOT", "DR", "UDDPLR", "RN", "NI-17",
        ]);
    });

    it("maps 16th legislature codes to the same families", () => {
        expect(getGroupeRangGaucheDroite("LFI-NUPES")).toBe(getGroupeRangGaucheDroite("LFI-NFP"));
        expect(getGroupeRangGaucheDroite("RE")).toBe(getGroupeRangGaucheDroite("EPR"));
        expect(getGroupeRangGaucheDroite("LR")).toBe(getGroupeRangGaucheDroite("DR"));
        expect(getGroupeRangGaucheDroite("ECOLO-NUPES")).toBe(getGroupeRangGaucheDroite("ECOS"));
    });

    it("places an unknown group just before the non-inscrits", () => {
        expect([ "NI-16", "XYZ", "RN"].sort(compareGroupesGaucheDroite)).toEqual(["RN", "XYZ", "NI-16"]);
    });
});

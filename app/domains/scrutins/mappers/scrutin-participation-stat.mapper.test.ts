import { mapScrutinParticipationStatToDTO } from "@/app/domains/scrutins/mappers/scrutin-participation-stat.mapper";

describe("mapScrutinParticipationStatToDTO", () => {
    it("maps mois/taux_participation rows to label/value points, rounded to 1 decimal", () => {
        const dto = mapScrutinParticipationStatToDTO([{ mois: "2024-09", taux_participation: 78.456 }]);
        expect(dto).toEqual({ points: [{ label: "2024-09", value: 78.5 }] });
    });

    it("defaults a null taux_participation to 0", () => {
        const dto = mapScrutinParticipationStatToDTO([{ mois: "2024-09", taux_participation: null }]);
        expect(dto).toEqual({ points: [{ label: "2024-09", value: 0 }] });
    });

    it("maps an empty list to an empty points array", () => {
        expect(mapScrutinParticipationStatToDTO([])).toEqual({ points: [] });
    });
});

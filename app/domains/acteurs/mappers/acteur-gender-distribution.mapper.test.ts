import { mapActeurGenderDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-gender-distribution.mapper";

describe("mapActeurGenderDistributionToDTO", () => {
    it("maps known civilités to their French label", () => {
        const dto = mapActeurGenderDistributionToDTO([
            { civilite: "M.", nb_acteurs: 64 },
            { civilite: "Mme", nb_acteurs: 36 },
        ]);

        expect(dto).toEqual({
            items: [
                { label: "Hommes", value: 64 },
                { label: "Femmes", value: 36 },
            ],
        });
    });

    it("falls back to the raw civilité when it isn't M. or Mme", () => {
        const dto = mapActeurGenderDistributionToDTO([{ civilite: "Autre", nb_acteurs: 1 }]);
        expect(dto).toEqual({ items: [{ label: "Autre", value: 1 }] });
    });

    it("maps an empty list to an empty items array", () => {
        expect(mapActeurGenderDistributionToDTO([])).toEqual({ items: [] });
    });
});

import { mapActeurAgeDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-age-distribution.mapper";

describe("mapActeurAgeDistributionToDTO", () => {
    it("maps tranche_age/nb_acteurs rows to label/value items", () => {
        const dto = mapActeurAgeDistributionToDTO([
            { tranche_age: "<30", nb_acteurs: 12 },
            { tranche_age: "30-39", nb_acteurs: 45 },
        ]);

        expect(dto).toEqual({
            items: [
                { label: "<30", value: 12 },
                { label: "30-39", value: 45 },
            ],
        });
    });

    it("maps an empty list to an empty items array", () => {
        expect(mapActeurAgeDistributionToDTO([])).toEqual({ items: [] });
    });
});

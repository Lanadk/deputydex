import { mapActeurProfessionDistributionToDTO, mapActeurProfessionFamilleDistributionToDTO } from "@/app/domains/acteurs/mappers/acteur-profession-distribution.mapper";

describe("mapActeurProfessionDistributionToDTO", () => {
    it("maps profession_categorie/nb_acteurs buckets to label/value items", () => {
        const dto = mapActeurProfessionDistributionToDTO([
            { profession_categorie: "Cadres et professions intellectuelles supérieures", nb_acteurs: 320 },
            { profession_categorie: "Non renseignée", nb_acteurs: 12 },
        ]);

        expect(dto).toEqual({
            items: [
                { label: "Cadres et professions intellectuelles supérieures", value: 320 },
                { label: "Non renseignée", value: 12 },
            ],
        });
    });

    it("maps an empty list to an empty items array", () => {
        expect(mapActeurProfessionDistributionToDTO([])).toEqual({ items: [] });
    });
});

describe("mapActeurProfessionFamilleDistributionToDTO", () => {
    it("maps profession_famille/nb_acteurs buckets to label/value items", () => {
        const dto = mapActeurProfessionFamilleDistributionToDTO([
            { profession_famille: "Ouvriers", nb_acteurs: 6 },
            { profession_famille: "Agriculteurs exploitants", nb_acteurs: 15 },
        ]);

        expect(dto).toEqual({
            items: [
                { label: "Ouvriers", value: 6 },
                { label: "Agriculteurs exploitants", value: 15 },
            ],
        });
    });

    it("maps an empty list to an empty items array", () => {
        expect(mapActeurProfessionFamilleDistributionToDTO([])).toEqual({ items: [] });
    });
});

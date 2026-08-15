import { mapLegislaturePariteEvolutionToDTO } from "@/app/domains/legislatures/mappers/legislature-parite-evolution.mapper";

describe("mapLegislaturePariteEvolutionToDTO", () => {
    it("computes the % de femmes per legislature, rounded to 1 decimal", () => {
        const dto = mapLegislaturePariteEvolutionToDTO([
            { legislature: 15, nb_hommes: 337, nb_femmes: 240 },
            { legislature: 16, nb_hommes: 328, nb_femmes: 249 },
        ]);

        expect(dto).toEqual({
            points: [
                { label: "15ᵉ", value: 41.6 },
                { label: "16ᵉ", value: 43.2 },
            ],
        });
    });

    it("defaults to 0 when a legislature has no members at all", () => {
        const dto = mapLegislaturePariteEvolutionToDTO([{ legislature: 15, nb_hommes: 0, nb_femmes: 0 }]);
        expect(dto).toEqual({ points: [{ label: "15ᵉ", value: 0 }] });
    });

    it("maps an empty list to an empty points array", () => {
        expect(mapLegislaturePariteEvolutionToDTO([])).toEqual({ points: [] });
    });
});

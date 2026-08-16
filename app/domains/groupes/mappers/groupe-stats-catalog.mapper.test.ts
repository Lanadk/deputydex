import {
    mapGroupeStatCohesionToDTO,
    mapGroupeStatEffectifsToDTO,
    mapGroupeStatExpressionVotesToDTO,
    mapGroupeStatPariteToDTO,
    mapGroupeStatPositionsVoteToDTO,
} from "@/app/domains/groupes/mappers/groupe-stats-catalog.mapper";

describe("mapGroupeStatPariteToDTO", () => {
    it("maps nb_hommes/nb_femmes to Hommes/Femmes items", () => {
        expect(mapGroupeStatPariteToDTO({ nb_hommes: 65, nb_femmes: 35 })).toEqual({
            items: [
                { label: "Hommes", value: 65 },
                { label: "Femmes", value: 35 },
            ],
        });
    });

    it("returns an empty items array when the group has no parité row", () => {
        expect(mapGroupeStatPariteToDTO(null)).toEqual({ items: [] });
    });
});

describe("mapGroupeStatEffectifsToDTO", () => {
    it("maps groupe_label/nb_acteurs rows to label/value items", () => {
        const dto = mapGroupeStatEffectifsToDTO([
            { groupe_code: "RN", groupe_label: "Rassemblement National", nb_acteurs: 88 },
        ]);
        expect(dto).toEqual({ items: [{ label: "Rassemblement National", value: 88 }] });
    });

    it("falls back to groupe_code when groupe_label is null", () => {
        const dto = mapGroupeStatEffectifsToDTO([{ groupe_code: "RN", groupe_label: null, nb_acteurs: 88 }]);
        expect(dto).toEqual({ items: [{ label: "RN", value: 88 }] });
    });
});

describe("mapGroupeStatCohesionToDTO", () => {
    it("maps mois/taux_cohesion rows to label/value points, formatting mois as YYYY-MM", () => {
        const dto = mapGroupeStatCohesionToDTO([{ mois: new Date("2024-09-01"), taux_cohesion: 85 }]);
        expect(dto).toEqual({ points: [{ label: "2024-09", value: 85 }] });
    });

    it("defaults a null taux_cohesion to 0", () => {
        const dto = mapGroupeStatCohesionToDTO([{ mois: new Date("2024-09-01"), taux_cohesion: null }]);
        expect(dto).toEqual({ points: [{ label: "2024-09", value: 0 }] });
    });
});

describe("mapGroupeStatPositionsVoteToDTO", () => {
    it("groups rows by groupe_code into one series per group, named by CODE (not the full libellé)", () => {
        const dto = mapGroupeStatPositionsVoteToDTO([
            { groupe_code: "RN", groupe_label: "Rassemblement National", position: "pour", pourcentage: 70 },
            { groupe_code: "RN", groupe_label: "Rassemblement National", position: "contre", pourcentage: 20 },
            { groupe_code: "RN", groupe_label: "Rassemblement National", position: "abstention", pourcentage: 10 },
            { groupe_code: "LFI", groupe_label: "La France insoumise", position: "pour", pourcentage: 40 },
            { groupe_code: "LFI", groupe_label: "La France insoumise", position: "contre", pourcentage: 55 },
            { groupe_code: "LFI", groupe_label: "La France insoumise", position: "abstention", pourcentage: 5 },
        ]);

        expect(dto).toEqual({
            series: [
                { name: "RN", items: [{ label: "Pour", value: 70 }, { label: "Contre", value: 20 }, { label: "Abstention", value: 10 }] },
                { name: "LFI", items: [{ label: "Pour", value: 40 }, { label: "Contre", value: 55 }, { label: "Abstention", value: 5 }] },
            ],
        });
    });

    it("returns an empty series array when there are no rows", () => {
        expect(mapGroupeStatPositionsVoteToDTO([])).toEqual({ series: [] });
    });
});

describe("mapGroupeStatExpressionVotesToDTO", () => {
    it("maps rows to label/value items, label = CODE (not the full libellé)", () => {
        const dto = mapGroupeStatExpressionVotesToDTO([
            { groupe_code: "RN", groupe_label: "Rassemblement National", taux_expression_votes: 92.5 },
        ]);
        expect(dto).toEqual({ items: [{ label: "RN", value: 92.5 }] });
    });

    it("defaults a null taux_expression_votes to 0", () => {
        const dto = mapGroupeStatExpressionVotesToDTO([{ groupe_code: "RN", groupe_label: null, taux_expression_votes: null }]);
        expect(dto).toEqual({ items: [{ label: "RN", value: 0 }] });
    });
});

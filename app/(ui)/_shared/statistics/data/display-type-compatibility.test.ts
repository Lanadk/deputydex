import { compatibleDisplayTypesFor } from "@/app/(ui)/_shared/statistics/data/display-type-compatibility";

describe("compatibleDisplayTypesFor", () => {
    it("renvoie tous les formats de la forme de donnée sans exclusion", () => {
        expect(compatibleDisplayTypesFor({ dataShape: "distribution" })).toEqual(["bar", "pie", "donut"]);
    });

    it("retire les formats exclus", () => {
        expect(compatibleDisplayTypesFor({ dataShape: "distribution", excludedDisplayTypes: ["pie", "donut"] })).toEqual(["bar"]);
    });

    it("garde la liste complète si l'exclusion retirerait tout", () => {
        expect(compatibleDisplayTypesFor({ dataShape: "points", excludedDisplayTypes: ["scatter"] })).toEqual(["scatter"]);
    });
});

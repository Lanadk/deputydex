import { makeRegistryHelper } from "@/app/(ui)/_shared/registry/registry.helper";

type Entry = { id: string; label: string };

const registry: Entry[] = [
    { id: "bar", label: "Bar chart" },
    { id: "pie", label: "Pie chart" },
];

describe("makeRegistryHelper", () => {
    it("returns the entry matching the given id", () => {
        const getEntry = makeRegistryHelper(registry, "charts");
        expect(getEntry("pie")).toEqual({ id: "pie", label: "Pie chart" });
    });

    it("throws a descriptive error listing the available ids when the id is not found", () => {
        const getEntry = makeRegistryHelper(registry, "charts");

        expect(() => getEntry("scatter")).toThrow(
            '[charts] Entrée introuvable : "scatter".\n' + 'Ids disponibles : "bar", "pie"'
        );
    });

    it("reports an empty registry explicitly rather than an empty id list", () => {
        const getEntry = makeRegistryHelper([], "charts");

        expect(() => getEntry("anything")).toThrow(
            '[charts] Entrée introuvable : "anything".\n' + 'Ids disponibles : (registre vide)'
        );
    });
});

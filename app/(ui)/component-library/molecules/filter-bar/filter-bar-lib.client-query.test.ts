import { applyFilterBarQueryClient } from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.client-query";

const rows = [
    { id: 1, label: "DEM-EPR", groupes: ["DEM", "EPR"], taux: 80 },
    { id: 2, label: "ECOS-SOC", groupes: ["ECOS", "SOC"], taux: 79 },
    { id: 3, label: "DR-UDDPLR", groupes: ["DR", "UDDPLR"], taux: 65 },
];

describe("applyFilterBarQueryClient", () => {
    it("keeps rows matching a scalar field", () => {
        const out = applyFilterBarQueryClient(rows, { orderBy: [], where: { label: { equals: "ECOS-SOC" } } });
        expect(out.map((r) => r.id)).toEqual([2]);
    });

    it("on an array field, keeps a row when ANY of its values matches (equals is exact, no substring match)", () => {
        expect(applyFilterBarQueryClient(rows, { orderBy: [], where: { groupes: { equals: "SOC" } } }).map((r) => r.id)).toEqual([2]);
        expect(applyFilterBarQueryClient(rows, { orderBy: [], where: { groupes: { equals: "DR" } } }).map((r) => r.id)).toEqual([3]);
    });

    it("on an array field, supports contains on any value", () => {
        const out = applyFilterBarQueryClient(rows, { orderBy: [], where: { groupes: { contains: "e" } } });
        expect(out.map((r) => r.id)).toEqual([1, 2]);
    });

    it("sorts by a numeric field", () => {
        const out = applyFilterBarQueryClient(rows, { orderBy: [{ taux: "asc" }], where: {} });
        expect(out.map((r) => r.id)).toEqual([3, 2, 1]);
    });
});

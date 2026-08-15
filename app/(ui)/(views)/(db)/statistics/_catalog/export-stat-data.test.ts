import { toExportRows } from "@/app/(ui)/(views)/(db)/statistics/_catalog/export-stat-data";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";

describe("toExportRows", () => {
    it("exports a distribution as label/value rows", () => {
        const data: RawStatData = { shape: "distribution", items: [{ label: "<30", value: 12 }] };
        const { rows, csvColumns } = toExportRows(data);

        expect(rows).toEqual([{ label: "<30", value: 12 }]);
        expect(csvColumns.map((c) => c.header)).toEqual(["Libellé", "Valeur"]);
        expect(csvColumns[0].value(rows[0])).toBe("<30");
        expect(csvColumns[1].value(rows[0])).toBe(12);
    });

    it("exports a timeseries as period/value rows", () => {
        const data: RawStatData = { shape: "timeseries", points: [{ label: "2024-01", value: 5 }] };
        const { rows, csvColumns } = toExportRows(data);

        expect(rows).toEqual([{ label: "2024-01", value: 5 }]);
        expect(csvColumns.map((c) => c.header)).toEqual(["Période", "Valeur"]);
    });

    it("flattens multi-series into serie/label/value rows", () => {
        const data: RawStatData = {
            shape: "multi-series",
            series: [
                { name: "Groupe A", items: [{ label: "2024", value: 1 }] },
                { name: "Groupe B", items: [{ label: "2024", value: 2 }] },
            ],
        };

        const { rows } = toExportRows(data);

        expect(rows).toEqual([
            { serie: "Groupe A", label: "2024", value: 1 },
            { serie: "Groupe B", label: "2024", value: 2 },
        ]);
    });

    it("exports points as label/x/y rows, defaulting label to empty string", () => {
        const data: RawStatData = { shape: "points", points: [{ x: 1, y: 2 }, { x: 3, y: 4, label: "P2" }] };
        const { rows } = toExportRows(data);

        expect(rows).toEqual([
            { label: "", x: 1, y: 2 },
            { label: "P2", x: 3, y: 4 },
        ]);
    });

    it("exports a scalar as a single row", () => {
        const data: RawStatData = { shape: "scalar", value: 88, label: "membres actifs" };
        const { rows } = toExportRows(data);

        expect(rows).toEqual([{ label: "membres actifs", value: 88 }]);
    });

    it("defaults a scalar's label to an empty string when absent", () => {
        const data: RawStatData = { shape: "scalar", value: 88 };
        const { rows } = toExportRows(data);

        expect(rows).toEqual([{ label: "", value: 88 }]);
    });
});

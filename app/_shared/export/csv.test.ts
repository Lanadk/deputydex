import { toCsv } from "@/app/_shared/export/csv";

type Row = { name: string; value: string | number | null };

const columns = [
    { header: "name", value: (r: Row) => r.name },
    { header: "value", value: (r: Row) => r.value },
];

describe("toCsv", () => {
    it("joins header + rows with the delimiter and prefixes a BOM by default", () => {
        const csv = toCsv<Row>([{ name: "a", value: 1 }], columns);
        expect(csv).toBe("﻿name;value\na;1");
    });

    it("uses a custom delimiter when provided", () => {
        const csv = toCsv<Row>([{ name: "a", value: 1 }], columns, { delimiter: "," });
        expect(csv).toBe("﻿name,value\na,1");
    });

    it("omits the BOM when includeBom is false", () => {
        const csv = toCsv<Row>([{ name: "a", value: 1 }], columns, { includeBom: false });
        expect(csv.startsWith("﻿")).toBe(false);
    });

    it("quotes a cell that contains the delimiter", () => {
        const csv = toCsv<Row>([{ name: "a;b", value: 1 }], columns);
        expect(csv).toContain('"a;b";1');
    });

    it("quotes and escapes a cell that contains double quotes", () => {
        const csv = toCsv<Row>([{ name: 'say "hi"', value: 1 }], columns);
        expect(csv).toContain('"say ""hi"""');
    });

    it("quotes a cell that contains a newline", () => {
        const csv = toCsv<Row>([{ name: "line1\nline2", value: 1 }], columns);
        expect(csv).toContain('"line1\nline2"');
    });

    it("does not quote a cell with no special characters", () => {
        const csv = toCsv<Row>([{ name: "plain", value: 1 }], columns);
        expect(csv).toContain("plain;1");
        expect(csv).not.toContain('"plain"');
    });

    it("renders null/undefined cell values as an empty string", () => {
        const csv = toCsv<Row>([{ name: "a", value: null }], columns);
        expect(csv).toBe("﻿name;value\na;");
    });

    it("produces just the header line for an empty row list", () => {
        const csv = toCsv<Row>([], columns);
        expect(csv).toBe("﻿name;value");
    });
});

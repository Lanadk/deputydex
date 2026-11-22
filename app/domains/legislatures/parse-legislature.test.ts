import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";

describe("parseLegislature", () => {
    it.each([["17", 17], ["16", 16], ["1", 1]])("accepts %s", (raw, expected) => {
        expect(parseLegislature(raw)).toEqual({ success: true, data: expected });
    });

    it.each(["abc", "", "17.5", "-1", "0", " 17", "17abc", "1e2"])("rejects %j", (raw) => {
        expect(parseLegislature(raw)).toEqual({ success: false, error: "INVALID_INPUT" });
    });
});

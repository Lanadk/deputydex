/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository", () => ({
    prismaActeursRepository: {
        search: jest.fn(),
        getById: jest.fn(),
        findManyForExport: jest.fn(),
    },
}));

import { POST } from "@/app/api/acteurs/export/route";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";

const findManyForExport = prismaActeursRepository.findManyForExport as jest.Mock;

function postWithBody(body: unknown) {
    return POST(new Request("http://localhost/api/acteurs/export", { method: "POST", body: JSON.stringify(body) }));
}

describe("POST /api/acteurs/export", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns a CSV attachment with the right headers by default", async () => {
        findManyForExport.mockResolvedValue([]);

        const res = await postWithBody({ query: { orderBy: [], where: {} } });

        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
        expect(res.headers.get("Content-Disposition")).toMatch(/^attachment; filename="acteurs_export_.*\.csv"$/);
        expect(res.headers.get("Cache-Control")).toBe("no-store");
    });

    it("returns a JSON attachment when format is 'json'", async () => {
        findManyForExport.mockResolvedValue([]);

        const res = await postWithBody({ format: "json" });

        expect(res.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
        expect(res.headers.get("Content-Disposition")).toMatch(/\.json"$/);
    });

    it("returns 500 when the repository throws", async () => {
        findManyForExport.mockRejectedValue(new Error("DB down"));

        const res = await postWithBody({});

        expect(res.status).toBe(500);
    });
});

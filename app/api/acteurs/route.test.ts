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

import { POST } from "@/app/api/acteurs/route";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";

const search = prismaActeursRepository.search as jest.Mock;

function postWithBody(body: unknown) {
    return POST(new Request("http://localhost/api/acteurs", { method: "POST", body: JSON.stringify(body) }));
}

describe("POST /api/acteurs", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the paginated + mapped result", async () => {
        search.mockResolvedValue({ items: [], total: 0 });

        const res = await postWithBody({ query: { orderBy: [], where: {} }, page: 1, pageSize: 20 });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ items: [], total: 0, page: 1, pageSize: 20, pageCount: 1 });
    });

    it("defaults query/page/pageSize when the body omits them", async () => {
        search.mockResolvedValue({ items: [], total: 0 });

        await postWithBody({});

        expect(search).toHaveBeenCalledWith({ orderBy: [], where: {} }, 1, 20);
    });

    it("returns 500 when the repository throws", async () => {
        search.mockRejectedValue(new Error("DB down"));

        const res = await postWithBody({});

        expect(res.status).toBe(500);
    });

    it("returns 500 when the request body is not valid JSON", async () => {
        const res = await POST(new Request("http://localhost/api/acteurs", { method: "POST", body: "not-json" }));

        expect(res.status).toBe(500);
    });
});

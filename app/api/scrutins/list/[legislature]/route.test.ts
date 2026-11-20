/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/scrutins/repositories/prisma-scrutin-list.repository", () => ({
    prismaScrutinListRepository: { getScrutinsPage: jest.fn() },
}));

import { GET } from "@/app/api/scrutins/list/[legislature]/route";
import { prismaScrutinListRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-list.repository";

const getScrutinsPage = prismaScrutinListRepository.getScrutinsPage as jest.Mock;

function call(legislature: string, search = "") {
    return GET(new Request(`http://localhost/api/scrutins/list/${legislature}${search}`), {
        params: Promise.resolve({ legislature }),
    });
}

describe("GET /api/scrutins/list/[legislature]", () => {
    afterEach(() => jest.restoreAllMocks());

    it("returns 200 with an empty page, forwarding the parsed legislature in the filters", async () => {
        getScrutinsPage.mockResolvedValue({ rows: [], total: 0 });

        const res = await call("17");

        expect(res.status).toBe(200);
        expect(getScrutinsPage).toHaveBeenCalledWith(expect.objectContaining({ legislature: 17 }));
        expect(await res.json()).toEqual(expect.objectContaining({ items: [], total: 0, pageCount: 1 }));
    });

    it("returns 400 when the legislature is not a number", async () => {
        getScrutinsPage.mockClear();

        const res = await call("abc");

        expect(res.status).toBe(400);
        expect(getScrutinsPage).not.toHaveBeenCalled();
    });

    it("returns 500 when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getScrutinsPage.mockRejectedValue(new Error("DB down"));

        const res = await call("17");

        expect(res.status).toBe(500);
    });
});

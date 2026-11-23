/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/scrutins/repositories/prisma-scrutins-periode.repository", () => ({
    prismaScrutinsPeriodeRepository: { getScrutinsDernierMois: jest.fn() },
}));

import { GET } from "@/app/api/scrutins/plus-serre/[legislature]/route";
import { prismaScrutinsPeriodeRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutins-periode.repository";

const getScrutinsDernierMois = prismaScrutinsPeriodeRepository.getScrutinsDernierMois as jest.Mock;

function call(legislature: string) {
    return GET(new Request(`http://localhost/api/scrutins/plus-serre/${legislature}`), {
        params: Promise.resolve({ legislature }),
    });
}

describe("GET /api/scrutins/plus-serre/[legislature]", () => {
    afterEach(() => jest.restoreAllMocks());

    it("returns 200 with nulls when the legislature has no dated scrutin", async () => {
        getScrutinsDernierMois.mockResolvedValue(null);

        const res = await call("17");

        expect(res.status).toBe(200);
        expect(getScrutinsDernierMois).toHaveBeenCalledWith(17);
        expect(await res.json()).toEqual({ periode: null, scrutin: null, ecart: null });
    });

    it("returns 400 when the legislature is not a number", async () => {
        getScrutinsDernierMois.mockClear();

        const res = await call("abc");

        expect(res.status).toBe(400);
        expect(getScrutinsDernierMois).not.toHaveBeenCalled();
    });

    it("returns 500 when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getScrutinsDernierMois.mockRejectedValue(new Error("DB down"));

        const res = await call("17");

        expect(res.status).toBe(500);
    });
});

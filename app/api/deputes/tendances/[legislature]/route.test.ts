/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/deputes/repositories/prisma-deputes-tendances.repository", () => ({
    prismaDeputesTendancesRepository: { getDeputesTendances: jest.fn() },
}));

import { GET } from "@/app/api/deputes/tendances/[legislature]/route";
import { prismaDeputesTendancesRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-tendances.repository";

const getDeputesTendances = prismaDeputesTendancesRepository.getDeputesTendances as jest.Mock;

function call(legislature: string) {
    return GET(new Request(`http://localhost/api/deputes/tendances/${legislature}`), {
        params: Promise.resolve({ legislature }),
    });
}

describe("GET /api/deputes/tendances/[legislature]", () => {
    afterEach(() => jest.restoreAllMocks());

    it("returns 200 with empty rankings when there is no recent activity", async () => {
        getDeputesTendances.mockResolvedValue([]);

        const res = await call("17");

        expect(res.status).toBe(200);
        expect(getDeputesTendances).toHaveBeenCalledWith(17);
        expect(await res.json()).toEqual({ periode: null, scrutins: 0, assidu: null, rebelle: null, amendements: null });
    });

    it("returns 400 when the legislature is not a number", async () => {
        getDeputesTendances.mockClear();

        const res = await call("abc");

        expect(res.status).toBe(400);
        expect(getDeputesTendances).not.toHaveBeenCalled();
    });

    it("returns 500 when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getDeputesTendances.mockRejectedValue(new Error("DB down"));

        const res = await call("17");

        expect(res.status).toBe(500);
    });
});

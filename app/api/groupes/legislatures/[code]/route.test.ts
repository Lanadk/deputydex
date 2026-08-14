/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-legislatures.repository", () => ({
    prismaGroupeLegislaturesRepository: { getGroupeLegislatures: jest.fn() },
}));

import { GET } from "@/app/api/groupes/legislatures/[code]/route";
import { prismaGroupeLegislaturesRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-legislatures.repository";

const getGroupeLegislatures = prismaGroupeLegislaturesRepository.getGroupeLegislatures as jest.Mock;

function call(code: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code }) });
}

describe("GET /api/groupes/legislatures/[code]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the list of legislature numbers", async () => {
        getGroupeLegislatures.mockResolvedValue([{ legislature: 16 }, { legislature: 17 }]);

        const res = await call("RE");

        expect(getGroupeLegislatures).toHaveBeenCalledWith("RE");
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([16, 17]);
    });

    it("returns 200 with an empty list when the code doesn't exist", async () => {
        getGroupeLegislatures.mockResolvedValue([]);

        const res = await call("UNKNOWN");

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([]);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeLegislatures.mockRejectedValue(new Error("DB down"));

        const res = await call("RE");

        expect(res.status).toBe(500);
    });
});

/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/legislatures/repositories/prisma-presidence-assemblee.repository", () => ({
    prismaPresidenceAssembleeRepository: { getPresidencesAssemblee: jest.fn() },
}));

import { GET } from "@/app/api/legislatures/[legislature]/presidence-assemblee/route";
import { prismaPresidenceAssembleeRepository } from "@/app/infrastructure/legislatures/repositories/prisma-presidence-assemblee.repository";

const getPresidencesAssemblee = prismaPresidenceAssembleeRepository.getPresidencesAssemblee as jest.Mock;
const call = (legislature: string) =>
    GET(new Request(`http://localhost/api/legislatures/${legislature}/presidence-assemblee`), { params: Promise.resolve({ legislature }) });

describe("GET /api/legislatures/[legislature]/presidence-assemblee", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.resetAllMocks());

    it("200 avec la présidence en place", async () => {
        getPresidencesAssemblee.mockResolvedValue([{ acteur_uid: "PA_YBP", prenom: "Yaël", nom: "Braun-Pivet", debut: "2024-07-18", fin: null }]);

        const res = await call("17");

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ uid: "PA_YBP", nom: "Yaël Braun-Pivet", depuis: "2024-07-18", jusqua: null });
        expect(getPresidencesAssemblee).toHaveBeenCalledWith(17);
    });

    it("404 sans présidence connue", async () => {
        getPresidencesAssemblee.mockResolvedValue([]);

        expect((await call("17")).status).toBe(404);
    });

    it("400 pour une législature invalide, sans lecture en base", async () => {
        expect((await call("abc")).status).toBe(400);
        expect(getPresidencesAssemblee).not.toHaveBeenCalled();
    });

    it("500 si la base échoue", async () => {
        getPresidencesAssemblee.mockRejectedValue(new Error("down"));

        expect((await call("17")).status).toBe(500);
    });
});

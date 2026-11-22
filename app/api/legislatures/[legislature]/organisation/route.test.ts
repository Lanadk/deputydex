/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository", () => ({
    prismaLegislatureOrganisationRepository: {
        getLegislatures: jest.fn(),
        getPremiersMinistres: jest.fn(),
        getPresidentsAssemblee: jest.fn(),
        getMembresGouvernement: jest.fn(),
        getFonctionsAssemblee: jest.fn(),
        getChiffres: jest.fn(),
        getEntreesEnCours: jest.fn(),
    },
}));

import { GET } from "@/app/api/legislatures/[legislature]/organisation/route";
import { prismaLegislatureOrganisationRepository as repo } from "@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository";

const call = (legislature: string) => GET(new Request("http://localhost"), { params: Promise.resolve({ legislature }) });

describe("GET /api/legislatures/[legislature]/organisation", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        (repo.getLegislatures as jest.Mock).mockResolvedValue([{ number: 17, debut: "2024-07-18", fin: null }]);
        (repo.getPremiersMinistres as jest.Mock).mockResolvedValue([]);
        (repo.getMembresGouvernement as jest.Mock).mockResolvedValue([]);
        (repo.getFonctionsAssemblee as jest.Mock).mockResolvedValue([]);
    });
    afterEach(() => jest.resetAllMocks());

    it("200 avec l'organisation de la législature", async () => {
        const res = await call("17");

        expect(res.status).toBe(200);
        expect(await res.json()).toMatchObject({ legislature: 17, gouvernements: [], assemblee: { president: null } });
    });

    it("400 pour un numéro de législature invalide", async () => {
        expect((await call("abc")).status).toBe(400);
    });

    it("404 pour une législature inconnue", async () => {
        expect((await call("99")).status).toBe(404);
    });

    it("500 si la base est indisponible", async () => {
        (repo.getLegislatures as jest.Mock).mockRejectedValue(new Error("DB down"));

        expect((await call("17")).status).toBe(500);
    });
});

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
        getMandatsPresidentiels: jest.fn(),
        getEvenementsInstitutionnels: jest.fn(),
        getFonctionsDefinitions: jest.fn(),
    },
}));

import { GET } from "@/app/api/legislatures/frise/route";
import { prismaLegislatureOrganisationRepository as repo } from "@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository";

describe("GET /api/legislatures/frise", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        (repo.getLegislatures as jest.Mock).mockResolvedValue([{ number: 17, debut: "2024-07-18", fin: null }]);
        (repo.getPremiersMinistres as jest.Mock).mockResolvedValue([]);
        (repo.getPresidentsAssemblee as jest.Mock).mockResolvedValue([]);
        (repo.getMandatsPresidentiels as jest.Mock).mockResolvedValue([]);
        (repo.getEvenementsInstitutionnels as jest.Mock).mockResolvedValue([]);
    });
    afterEach(() => jest.resetAllMocks());

    it("200 avec les couloirs de la frise", async () => {
        const res = await GET();

        expect(res.status).toBe(200);
        const frise = await res.json();
        expect(frise.couloirs.map((c: { id: string }) => c.id)).toEqual(["presidence", "legislatures", "gouvernements", "assemblee"]);
        expect(frise.debut).toBe("2024-07-18");
    });

    it("500 si la base est indisponible", async () => {
        (repo.getLegislatures as jest.Mock).mockRejectedValue(new Error("DB down"));

        expect((await GET()).status).toBe(500);
    });
});

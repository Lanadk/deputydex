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

import { GET } from "@/app/api/legislatures/[legislature]/chiffres/route";
import { prismaLegislatureOrganisationRepository as repo } from "@/app/infrastructure/legislatures/repositories/prisma-legislature-organisation.repository";

const call = (legislature: string) => GET(new Request("http://localhost"), { params: Promise.resolve({ legislature }) });

describe("GET /api/legislatures/[legislature]/chiffres", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        (repo.getLegislatures as jest.Mock).mockResolvedValue([{ number: 16, debut: "2022-06-28", fin: "2024-06-09" }]);
        (repo.getPremiersMinistres as jest.Mock).mockResolvedValue([]);
        (repo.getChiffres as jest.Mock).mockResolvedValue({ scrutins: 4106, deputes_ayant_siege: 620 });
        (repo.getEntreesEnCours as jest.Mock).mockResolvedValue([{ cause: "élection partielle", nombre: 5 }]);
    });
    afterEach(() => jest.resetAllMocks());

    it("200 avec les chiffres de la législature", async () => {
        const res = await call("16");

        expect(res.status).toBe(200);
        expect(await res.json()).toMatchObject({
            legislature: 16, scrutins: 4106, deputesAyantSiege: 620, entreesEnCours: 5,
            entreesParMotif: [{ motif: "partielle", nombre: 5 }],
        });
    });

    it("400 pour un numéro de législature invalide", async () => {
        expect((await call("abc")).status).toBe(400);
    });

    it("404 pour une législature inconnue", async () => {
        expect((await call("99")).status).toBe(404);
    });

    it("500 si la base est indisponible", async () => {
        (repo.getChiffres as jest.Mock).mockRejectedValue(new Error("DB down"));

        expect((await call("16")).status).toBe(500);
    });
});

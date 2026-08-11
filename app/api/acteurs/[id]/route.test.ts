/**
 * @jest-environment node
 *
 * Les Route Handlers Next.js reposent sur les globals Fetch API (Request,
 * Response, Headers) fournis par le runtime Node — jsdom (l'environnement
 * par défaut du projet, pour les tests de composants) ne les expose pas.
 */

jest.mock("@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository", () => ({
    prismaActeursRepository: {
        search: jest.fn(),
        getById: jest.fn(),
        findManyForExport: jest.fn(),
    },
}));

import { GET } from "@/app/api/acteurs/[id]/route";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";

const getById = prismaActeursRepository.getById as jest.Mock;

describe("GET /api/acteurs/[id]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the acteur DTO when found", async () => {
        getById.mockResolvedValue({
            uid: "PA1",
            prenom: "Jean",
            nom: "Dupont",
            profession_categorie: "Parlementaire",
            date_naissance: null,
        });

        const res = await GET(new Request("http://localhost/api/acteurs/PA1"), {
            params: Promise.resolve({ id: "PA1" }),
        });

        expect(getById).toHaveBeenCalledWith("PA1");
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(
            expect.objectContaining({ id: "PA1", nom: "Dupont" })
        );
    });

    it("returns 404 when the acteur is not found", async () => {
        getById.mockResolvedValue(null);

        const res = await GET(new Request("http://localhost/api/acteurs/UNKNOWN"), {
            params: Promise.resolve({ id: "UNKNOWN" }),
        });

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: "NOT_FOUND" });
    });

    it("returns 500 when the repository throws", async () => {
        getById.mockRejectedValue(new Error("DB down"));

        const res = await GET(new Request("http://localhost/api/acteurs/PA1"), {
            params: Promise.resolve({ id: "PA1" }),
        });

        expect(res.status).toBe(500);
    });
});

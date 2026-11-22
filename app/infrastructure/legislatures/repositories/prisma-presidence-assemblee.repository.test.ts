/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/db/prisma/prisma", () => ({ prisma: { $queryRaw: jest.fn() } }));

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { prismaPresidenceAssembleeRepository } from "@/app/infrastructure/legislatures/repositories/prisma-presidence-assemblee.repository";

const queryRaw = prisma.$queryRaw as unknown as jest.Mock;

describe("prismaPresidenceAssembleeRepository.getPresidencesAssemblee", () => {
    afterEach(() => jest.resetAllMocks());

    it("renvoie les mandats lus, filtrés sur la législature demandée", async () => {
        const rows = [{ acteur_uid: "PA721908", prenom: "Yaël", nom: "Braun-Pivet", debut: "2024-07-18", fin: null }];
        queryRaw.mockResolvedValue(rows);

        await expect(prismaPresidenceAssembleeRepository.getPresidencesAssemblee(17)).resolves.toEqual(rows);
        // Requête taguée : la législature est passée en paramètre, pas concaténée.
        const [, ...valeurs] = queryRaw.mock.calls[0];
        expect(valeurs).toEqual([17]);
    });

    it("lève une erreur qui garde la cause si la base échoue", async () => {
        const cause = new Error("connexion refusée");
        queryRaw.mockRejectedValue(cause);

        await expect(prismaPresidenceAssembleeRepository.getPresidencesAssemblee(17)).rejects.toMatchObject({
            message: expect.stringContaining("législature 17"),
            cause,
        });
    });
});

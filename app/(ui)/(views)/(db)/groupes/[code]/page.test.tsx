/**
 * @jest-environment node
 */

const NOT_FOUND = new Error("NEXT_NOT_FOUND");
jest.mock("next/navigation", () => ({ notFound: jest.fn(() => { throw NOT_FOUND; }) }));
jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-legislatures.repository", () => ({
    prismaGroupeLegislaturesRepository: { getGroupeLegislatures: jest.fn() },
}));
// Importés par generateMetadata (non testé ici) : on évite de charger le vrai client Prisma.
jest.mock("@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository", () => ({
    prismaLegislaturesRepository: {},
}));
jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository", () => ({
    prismaGroupeInfosRepository: {},
}));
jest.mock("@/app/(ui)/(views)/(db)/groupes/[code]/groupe-page-client", () => ({ __esModule: true, default: () => null }));

import GroupePage from "@/app/(ui)/(views)/(db)/groupes/[code]/page";
import { notFound } from "next/navigation";
import { prismaGroupeLegislaturesRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-legislatures.repository";

const getGroupeLegislatures = prismaGroupeLegislaturesRepository.getGroupeLegislatures as jest.Mock;

function render(code: string) {
    return GroupePage({ params: Promise.resolve({ code }) });
}

describe("GroupePage (fiche groupe, serveur)", () => {
    afterEach(() => jest.clearAllMocks());

    it("answers 404 (notFound) for a group code that never existed", async () => {
        getGroupeLegislatures.mockResolvedValue([]);

        await expect(render("INEXISTANT")).rejects.toBe(NOT_FOUND);
        expect(notFound).toHaveBeenCalled();
    });

    it("renders the page for a code that only existed in an old legislature (RE in 16e)", async () => {
        getGroupeLegislatures.mockResolvedValue([{ legislature: 16 }]);

        await expect(render("RE")).resolves.toBeTruthy();
        expect(notFound).not.toHaveBeenCalled();
    });

    it("does not turn a database error into a 404", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getGroupeLegislatures.mockRejectedValue(new Error("DB down"));

        await expect(render("RN")).resolves.toBeTruthy();
        expect(notFound).not.toHaveBeenCalled();
    });
});

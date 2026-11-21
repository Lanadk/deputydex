/**
 * @jest-environment node
 */

const NOT_FOUND = new Error("NEXT_NOT_FOUND");
jest.mock("next/navigation", () => ({ notFound: jest.fn(() => { throw NOT_FOUND; }) }));
jest.mock("@/app/infrastructure/deputes/repositories/prisma-depute-legislatures.repository", () => ({
    prismaDeputeLegislaturesRepository: { getDeputeLegislatures: jest.fn() },
}));
jest.mock("@/app/(ui)/(views)/(db)/deputes/[uid]/depute-page-client", () => ({ __esModule: true, default: () => null }));

import DeputePage from "@/app/(ui)/(views)/(db)/deputes/[uid]/page";
import { notFound } from "next/navigation";
import { prismaDeputeLegislaturesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-legislatures.repository";

const getDeputeLegislatures = prismaDeputeLegislaturesRepository.getDeputeLegislatures as jest.Mock;

function render(uid: string) {
    return DeputePage({ params: Promise.resolve({ uid }) });
}

describe("DeputePage (fiche député, serveur)", () => {
    afterEach(() => jest.clearAllMocks());

    it("answers 404 (notFound) for a deputy who never sat in any legislature", async () => {
        getDeputeLegislatures.mockResolvedValue([]);

        await expect(render("INEXISTANT")).rejects.toBe(NOT_FOUND);
        expect(notFound).toHaveBeenCalled();
    });

    it("renders the page for a deputy of an old legislature only (16e)", async () => {
        getDeputeLegislatures.mockResolvedValue([{ legislature: 16 }]);

        await expect(render("PA1206")).resolves.toBeTruthy();
        expect(notFound).not.toHaveBeenCalled();
    });

    it("does not turn a database error into a 404", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getDeputeLegislatures.mockRejectedValue(new Error("DB down"));

        await expect(render("PA842001")).resolves.toBeTruthy();
        expect(notFound).not.toHaveBeenCalled();
    });
});

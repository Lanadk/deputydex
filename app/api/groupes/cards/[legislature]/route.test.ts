/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupes-cards.repository", () => ({
    prismaGroupesCardsRepository: { getGroupesCards: jest.fn() },
}));

import { GET } from "@/app/api/groupes/cards/[legislature]/route";
import { prismaGroupesCardsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-cards.repository";

const getGroupesCards = prismaGroupesCardsRepository.getGroupesCards as jest.Mock;

function call(legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ legislature }) });
}

describe("GET /api/groupes/cards/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the mapped list of group cards, forwarding legislature as a number", async () => {
        getGroupesCards.mockResolvedValue([
            {
                groupe_id: "1",
                groupe_code: "REN",
                groupe_label: "Renaissance",
                groupe_president_full_name: "Jane Doe",
                groupe_label_type_sex: "Présidente",
                groupe_count_members: 88,
            },
        ]);

        const res = await call("17");

        expect(getGroupesCards).toHaveBeenCalledWith(17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([expect.objectContaining({ groupeCode: "REN" })]);
    });

    it("returns 500 when the repository resolves null", async () => {
        getGroupesCards.mockResolvedValue(null);

        const res = await call("17");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupesCards.mockRejectedValue(new Error("DB down"));

        const res = await call("17");

        expect(res.status).toBe(500);
    });
});

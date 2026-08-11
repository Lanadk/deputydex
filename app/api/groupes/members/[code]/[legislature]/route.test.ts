/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-members.repository", () => ({
    prismaGroupeMembersRepository: { getGroupeMembers: jest.fn() },
}));

import { GET } from "@/app/api/groupes/members/[code]/[legislature]/route";
import { prismaGroupeMembersRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-members.repository";

const getGroupeMembers = prismaGroupeMembersRepository.getGroupeMembers as jest.Mock;

function call(code: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code, legislature }) });
}

describe("GET /api/groupes/members/[code]/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the mapped members list", async () => {
        getGroupeMembers.mockResolvedValue([
            { first_name: "Jean", last_name: "Dupont", since: new Date("2024-07-08"), circonscription: "1ère (Paris)", age: 52 },
        ]);

        const res = await call("REN", "17");

        expect(getGroupeMembers).toHaveBeenCalledWith("REN", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([
            expect.objectContaining({ deputyFirstName: "Jean", deputyLastName: "Dupont" }),
        ]);
    });

    it("returns 500 (not 404) when the repository resolves null", async () => {
        getGroupeMembers.mockResolvedValue(null);

        const res = await call("UNKNOWN", "17");

        expect(res.status).toBe(500);
    });

    it("returns 500 when the repository throws", async () => {
        getGroupeMembers.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

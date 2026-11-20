/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository", () => ({
    prismaGroupeInfosRepository: { getGroupeInfos: jest.fn() },
}));

import { GET } from "@/app/api/groupes/infos/[code]/[legislature]/route";
import { prismaGroupeInfosRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository";

const getGroupeInfos = prismaGroupeInfosRepository.getGroupeInfos as jest.Mock;

function call(code: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ code, legislature }) });
}

const ROW = {
    legislature: 17,
    groupe_id: "1",
    groupe_label: "Renaissance",
    groupe_code: "REN",
    groupe_position: "Centre",
    groupe_count_members: 88,
    groupe_rank: 2,
    groupe_year_of_creation: "2016",
    groupe_web_site: "https://example.org",
    groupe_president_full_name: "Jane Doe",
    groupe_quality_sex_label: "Présidente",
    groupe_seats_share_percent: 15.3,
};

describe("GET /api/groupes/infos/[code]/[legislature]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the group info DTO, forwarding code + legislature as a number", async () => {
        getGroupeInfos.mockResolvedValue([ROW]);

        const res = await call("REN", "17");

        expect(getGroupeInfos).toHaveBeenCalledWith("REN", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(expect.objectContaining({ groupeCode: "REN" }));
    });

    it("returns 404 when the group does not exist in this legislature", async () => {
        getGroupeInfos.mockResolvedValue([]);

        const res = await call("INEXISTANT", "17");

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: "NOT_FOUND", message: "Groupe introuvable" });
    });

    it("returns 400 when the legislature is not a number", async () => {
        const res = await call("RN", "abc");

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "INVALID_INPUT", message: "Paramètre invalide" });
        expect(getGroupeInfos).not.toHaveBeenCalled();
    });

    it("returns 500 when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getGroupeInfos.mockRejectedValue(new Error("DB down"));

        const res = await call("REN", "17");

        expect(res.status).toBe(500);
    });
});

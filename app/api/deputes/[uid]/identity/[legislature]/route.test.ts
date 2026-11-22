/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/deputes/repositories/prisma-depute-identity.repository", () => ({
    prismaDeputeIdentityRepository: { getDeputeIdentity: jest.fn() },
}));
jest.mock("@/app/domains/deputes/mappers/depute-identity.mapper", () => ({
    mapDeputeIdentityEntityToDTO: (entity: { uid: string }) => ({ uid: entity.uid }),
}));

import { GET } from "@/app/api/deputes/[uid]/identity/[legislature]/route";
import { prismaDeputeIdentityRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-identity.repository";

const getDeputeIdentity = prismaDeputeIdentityRepository.getDeputeIdentity as jest.Mock;

function call(uid: string, legislature: string) {
    return GET(new Request("http://localhost"), { params: Promise.resolve({ uid, legislature }) });
}

describe("GET /api/deputes/[uid]/identity/[legislature]", () => {
    afterEach(() => jest.restoreAllMocks());

    it("returns 200 with the identity, forwarding legislature as a number", async () => {
        getDeputeIdentity.mockResolvedValue({ uid: "PA1" });

        const res = await call("PA1", "17");

        expect(getDeputeIdentity).toHaveBeenCalledWith("PA1", 17);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ uid: "PA1" });
    });

    it("returns 404 when the deputy has no mandate in this legislature", async () => {
        getDeputeIdentity.mockResolvedValue(null);

        const res = await call("PA1", "16");

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: "NOT_FOUND", message: "Député introuvable" });
    });

    it("returns 400 when the legislature is not a number", async () => {
        getDeputeIdentity.mockClear();

        const res = await call("PA1", "abc");

        expect(res.status).toBe(400);
        expect(getDeputeIdentity).not.toHaveBeenCalled();
    });

    it("returns 500 when the repository throws", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getDeputeIdentity.mockRejectedValue(new Error("DB down"));

        const res = await call("PA1", "17");

        expect(res.status).toBe(500);
    });
});

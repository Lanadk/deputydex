/**
 * @jest-environment node
 */
jest.mock("next/cache", () => ({ revalidateTag: jest.fn() }));

import { revalidateTag } from "next/cache";
import { POST } from "@/app/api/revalidate/route";

const SECRET = "s3cr3t";
const post = (headers: Record<string, string>) =>
    POST(new Request("http://localhost/api/revalidate", { method: "POST", headers }));

describe("POST /api/revalidate", () => {
    const original = process.env.REVALIDATE_SECRET;

    beforeEach(() => {
        process.env.REVALIDATE_SECRET = SECRET;
        jest.mocked(revalidateTag).mockClear();
        jest.spyOn(console, "info").mockImplementation(() => {});
    });

    afterAll(() => {
        process.env.REVALIDATE_SECRET = original;
    });

    it("vide tout le cache des données parlementaires pour l'appel autorisé", async () => {
        const res = await post({ authorization: `Bearer ${SECRET}` });

        expect(res.status).toBe(200);
        expect(await res.json()).toMatchObject({ revalidated: true, tag: "parliament-data" });
        expect(revalidateTag).toHaveBeenCalledWith("parliament-data", { expire: 0 });
    });

    it("401 pour un appel non autorisé, sans rien vider", async () => {
        const res = await post({ authorization: "Bearer mauvais" });

        expect(res.status).toBe(401);
        expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("404 pour un appel refusé, sans rien vider", async () => {
        const res = await post({ authorization: `Bearer ${SECRET}`, "x-real-ip": "203.0.113.7" });

        expect(res.status).toBe(404);
        expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("404 sans configuration", async () => {
        delete process.env.REVALIDATE_SECRET;

        const res = await post({ authorization: "Bearer " });

        expect(res.status).toBe(404);
        expect(revalidateTag).not.toHaveBeenCalled();
    });
});

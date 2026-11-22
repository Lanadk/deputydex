/**
 * @jest-environment node
 */

import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { err, ok } from "@/app/_shared/result-pattern/result";

describe("resultToResponse", () => {
    it("answers 200 with the data and cache headers on success", async () => {
        const res = resultToResponse(ok({ a: 1 }));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ a: 1 });
        expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    });

    it.each([
        ["NOT_FOUND", 404, "Ressource introuvable"],
        ["INVALID_INPUT", 400, "Paramètre invalide"],
        ["DB_ERROR", 500, "Erreur serveur"],
    ] as const)("maps %s to %i with a default message", async (error, status, message) => {
        const res = resultToResponse(err(error));

        expect(res.status).toBe(status);
        expect(await res.json()).toEqual({ error, message });
        expect(res.headers.get("Cache-Control")).toBeNull();
    });

    it("uses the message given for an error", async () => {
        const res = resultToResponse(err("NOT_FOUND"), { NOT_FOUND: "Groupe introuvable" });

        expect(await res.json()).toEqual({ error: "NOT_FOUND", message: "Groupe introuvable" });
    });
});

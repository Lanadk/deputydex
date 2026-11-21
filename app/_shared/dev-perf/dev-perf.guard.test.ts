/**
 * @jest-environment node
 */
import { isLocalRequest } from "@/app/_shared/dev-perf/dev-perf.guard";

const req = (headers: Record<string, string>) => new Headers(headers);

describe("isLocalRequest", () => {
    it("accepte une requête faite depuis la machine (avec ou sans port)", () => {
        expect(isLocalRequest(req({ host: "localhost:3000" }))).toBe(true);
        expect(isLocalRequest(req({ host: "127.0.0.1:3100" }))).toBe(true);
        expect(isLocalRequest(req({ host: "[::1]:3000" }))).toBe(true);
        expect(isLocalRequest(req({ host: "localhost:3000", "x-forwarded-for": "127.0.0.1, ::1" }))).toBe(true);
    });

    it("refuse le domaine public", () => {
        expect(isLocalRequest(req({ host: "deputedex.fr" }))).toBe(false);
        expect(isLocalRequest(req({}))).toBe(false);
    });

    it("refuse un Host falsifié arrivé par un proxy, qui porte l'IP du visiteur", () => {
        expect(isLocalRequest(req({ host: "localhost", "x-forwarded-for": "203.0.113.7" }))).toBe(false);
        expect(isLocalRequest(req({ host: "localhost", "x-forwarded-for": "127.0.0.1, 203.0.113.7" }))).toBe(false);
        expect(isLocalRequest(req({ host: "127.0.0.1", "x-real-ip": "198.51.100.2" }))).toBe(false);
    });
});

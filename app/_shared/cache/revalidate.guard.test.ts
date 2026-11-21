/**
 * @jest-environment node
 */
import { checkRevalidateAccess } from "@/app/_shared/cache/revalidate.guard";

const SECRET = "s3cr3t";
const headers = (h: Record<string, string>) => new Headers(h);

describe("checkRevalidateAccess", () => {
    it("autorise l'appel attendu", () => {
        expect(checkRevalidateAccess(headers({ authorization: `Bearer ${SECRET}` }), SECRET)).toBe("allowed");
        expect(checkRevalidateAccess(headers({ authorization: `Bearer ${SECRET}`, "x-forwarded-for": "172.18.0.1" }), SECRET)).toBe("allowed");
    });

    it("refuse les autres appels", () => {
        expect(checkRevalidateAccess(headers({}), SECRET)).toBe("unauthorized");
        expect(checkRevalidateAccess(headers({ authorization: "Bearer autre" }), SECRET)).toBe("unauthorized");
        expect(checkRevalidateAccess(headers({ authorization: `Bearer ${SECRET}x` }), SECRET)).toBe("unauthorized");
        expect(checkRevalidateAccess(headers({ authorization: SECRET }), SECRET)).toBe("unauthorized");
        expect(checkRevalidateAccess(headers({ authorization: `Bearer ${SECRET}`, "x-real-ip": "203.0.113.7" }), SECRET)).toBe("public");
    });

    it("désactivée sans configuration", () => {
        expect(checkRevalidateAccess(headers({ authorization: "Bearer " }), undefined)).toBe("disabled");
        expect(checkRevalidateAccess(headers({ authorization: "Bearer " }), "")).toBe("disabled");
    });
});

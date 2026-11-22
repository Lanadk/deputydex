import { timingSafeEqual } from "crypto";

/** Accès à `POST /api/revalidate`, réservé à l'import de deputydex-data. */
export type RevalidateAccess = "allowed" | "disabled" | "public" | "unauthorized";

export function checkRevalidateAccess(headers: Headers, secret: string | undefined): RevalidateAccess {
    if (!secret) return "disabled";
    if (headers.has("x-real-ip")) return "public";

    const authorization = headers.get("authorization") ?? "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
    return sameSecret(token, secret) ? "allowed" : "unauthorized";
}

function sameSecret(token: string, secret: string): boolean {
    const a = Buffer.from(token);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
}

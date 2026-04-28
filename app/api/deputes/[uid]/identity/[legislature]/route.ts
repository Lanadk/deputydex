import { NextResponse } from "next/server";
import { getDeputeIdentityUseCase } from "@/app/domains/deputes/use-cases/get-depute-identity.use-case";
import { prismaDeputeIdentityRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-identity.repository";
import { isOk } from "@/app/_shared/result-pattern/result";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = await getDeputeIdentityUseCase(
            prismaDeputeIdentityRepository,
            uid,
            Number(legislature)
        );
        if (isOk(result)) return NextResponse.json(result.data);
        if (result.error === "NOT_FOUND") return NextResponse.json({ error: "Député introuvable" }, { status: 404 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute identity" }, { status: 500 });
    }
}

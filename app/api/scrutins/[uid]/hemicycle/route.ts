import { NextResponse } from "next/server";
import { getScrutinHemicycleUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-hemicycle.use-case";
import { prismaScrutinDetailRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-detail.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string }> }
): Promise<Response> {
    const { uid } = await params;
    try {
        const result = await cachedRead(
            () => getScrutinHemicycleUseCase(prismaScrutinDetailRepository, uid),
            ["scrutin-hemicycle", uid]
        );
        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get scrutin hemicycle" }, { status: 500 });
    }
}

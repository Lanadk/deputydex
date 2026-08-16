import { NextResponse } from "next/server";
import { getDeputeMandatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-mandats.use-case";
import { prismaDeputeMandatsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-mandats.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string }> }
): Promise<Response> {
    const { uid } = await params;
    try {
        const result = await cachedRead(
            () => getDeputeMandatsUseCase(prismaDeputeMandatsRepository, uid),
            ["depute-mandats", uid]
        );
        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute mandats" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getDeputeAmendementStatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-amendement-stats.use-case";
import { prismaDeputeAmendementStatsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-amendement-stats.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = await cachedRead(
            () => getDeputeAmendementStatsUseCase(prismaDeputeAmendementStatsRepository, uid, Number(legislature)),
            ["depute-amendement-stats", uid, legislature]
        );
        if (isOk(result)) return cachedJson(result.data);
        if (result.error === "NOT_FOUND") return NextResponse.json({ error: "Aucune donnée d'amendement" }, { status: 404 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute amendement stats" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getDeputeRecentVotesUseCase } from "@/app/domains/deputes/use-cases/get-depute-recent-votes.use-case";
import { prismaDeputeRecentVotesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-recent-votes.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = await cachedRead(
            () => getDeputeRecentVotesUseCase(prismaDeputeRecentVotesRepository, uid, Number(legislature), 20),
            ["depute-recent-votes", uid, legislature]
        );
        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute recent votes" }, { status: 500 });
    }
}

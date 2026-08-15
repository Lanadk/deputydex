import { NextResponse } from "next/server";
import { getDeputeRecentVotesUseCase } from "@/app/domains/deputes/use-cases/get-depute-recent-votes.use-case";
import { prismaDeputeRecentVotesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-recent-votes.repository";
import { isOk } from "@/app/_shared/result-pattern/result";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = await getDeputeRecentVotesUseCase(
            prismaDeputeRecentVotesRepository,
            uid,
            Number(legislature),
            20
        );
        if (isOk(result)) return NextResponse.json(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute recent votes" }, { status: 500 });
    }
}

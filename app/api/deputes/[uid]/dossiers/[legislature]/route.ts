import { NextResponse } from "next/server";
import { getDeputeDossierContributionsUseCase } from "@/app/domains/deputes/use-cases/get-depute-dossier-contributions.use-case";
import { prismaDeputeDossiersRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-dossiers.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = await cachedRead(
            () => getDeputeDossierContributionsUseCase(prismaDeputeDossiersRepository, uid, Number(legislature)),
            ["depute-dossiers", uid, legislature]
        );
        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute dossiers" }, { status: 500 });
    }
}

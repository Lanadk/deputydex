import { NextResponse } from "next/server";
import { getDeputesCardsSampleUseCase } from "@/app/domains/deputes/use-cases/get-deputes-cards-sample.use-case";
import { prismaDeputesCardsRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-cards.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

/**
 * Échantillon représentatif (proportionnel aux effectifs par groupe) des
 * cartes députés d'une législature — utilisé par le mur de cartes de
 * l'accueil, qui n'affiche que quelques dizaines de cartes. Tirage
 * déterministe : voir `sampleDeputesCards`.
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    try {
        const result = await cachedRead(
            () => getDeputesCardsSampleUseCase(prismaDeputesCardsRepository, Number(legislature)),
            ["depute-cards-sample", legislature]
        );
        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get deputes cards sample" }, { status: 500 });
    }
}

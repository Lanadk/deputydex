import { NextResponse } from "next/server";
import {getGroupeCardsUseCase} from "@/app/domains/groupes/use-cases/get-groupe-cards.use-case";
import {prismaGroupesCardsRepository} from "@/app/infrastructure/groupes/repositories/prisma-groupes-cards.repository";
import {isOk} from "@/app/_shared/result-pattern/result";
import {cachedJson, cachedRead} from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const legislatureNumber = Number(legislature);
    try {

        const result = await cachedRead(
            () => getGroupeCardsUseCase(prismaGroupesCardsRepository, legislatureNumber),
            ["groupe-cards", legislature]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json(
            { error: result.error },
            { status: 500 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Failed to get groupes cards" },
            { status: 500 }
        );
    }
}
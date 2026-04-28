import { NextResponse } from "next/server";
import {getGroupeCardsUseCase} from "@/app/domains/groupes/use-cases/get-groupe-cards.use-case";
import {prismaGroupesCardsRepository} from "@/app/infrastructure/groupes/repositories/prisma-groupes-cards.repository";
import {isOk} from "@/app/_shared/result-pattern/result";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const legislatureNumber = Number(legislature);
    try {

        const result = await getGroupeCardsUseCase(
            prismaGroupesCardsRepository,
            legislatureNumber
        );

        if (isOk(result)) {
            return NextResponse.json(result.data);
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
import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getDeputesCardsUseCase} from "@/app/domains/deputes/use-cases/get-deputes-cards.use-case";
import {prismaDeputesCardsRepository} from "@/app/infrastructure/deputes/repositories/prisma-deputes-cards.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const legislatureNumber = Number(legislature);
    try {

        const result = await getDeputesCardsUseCase(
            prismaDeputesCardsRepository,
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
            { error: "Failed to get deputes cards" },
            { status: 500 }
        );
    }
}
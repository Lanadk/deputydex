import { NextResponse } from "next/server";
import { getDeputesAgeExtremesUseCase } from "@/app/domains/deputes/use-cases/get-deputes-age-extremes.use-case";
import { prismaDeputesAgeRepository } from "@/app/infrastructure/deputes/repositories/prisma-deputes-age.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const legislatureNumber = Number(legislature);

    try {
        const result = await cachedRead(
            () => getDeputesAgeExtremesUseCase(prismaDeputesAgeRepository, legislatureNumber),
            ["deputes-age-extremes", legislature]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json({ error: result.error }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get deputes age extremes" }, { status: 500 });
    }
}

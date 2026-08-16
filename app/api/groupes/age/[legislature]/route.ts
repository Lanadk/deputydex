import { NextResponse } from "next/server";
import { getGroupesAgeUseCase } from "@/app/domains/groupes/use-cases/get-groupes-age.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";
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
            () => getGroupesAgeUseCase(prismaGroupesStatsRepository, legislatureNumber),
            ["groupes-age", legislature]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json({ error: result.error }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get groupes age" }, { status: 500 });
    }
}

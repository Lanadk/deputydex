import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";
import { searchDeputiesUseCase } from "@/app/domains/acteurs/use-cases/search-deputies.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";

export async function GET(req: Request): Promise<Response> {
    try {
        const search = new URL(req.url).searchParams.get("search") ?? undefined;

        const result = await cachedRead(
            () => searchDeputiesUseCase(prismaActeursStatsRepository, search),
            ["deputies-search", search ?? ""]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json({ error: "Failed to search deputies" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to search deputies" }, { status: 500 });
    }
}

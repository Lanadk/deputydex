import { NextResponse } from "next/server";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";
import { searchActeursUseCase } from "@/app/domains/acteurs/use-cases/search-acteurs.use-case";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = await searchActeursUseCase(
            prismaActeursRepository,
            body?.query ?? { orderBy: [], where: {} },
            body?.page ?? 1,
            body?.pageSize ?? 20
        );

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to search acteurs" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { prismaActeursRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";
import { searchActeursUseCase } from "@/app/domains/acteurs/use-cases/search-acteurs.use-case";
import { err, isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";

export async function POST(
    req: Request
): Promise<Response> {
    const body = await req.json().catch(() => null);
    if (!body) return resultToResponse(err("INVALID_INPUT"), { INVALID_INPUT: "Corps JSON invalide" });

    const result = await searchActeursUseCase(
        prismaActeursRepository,
        body.query ?? { orderBy: [], where: {} },
        body.page ?? 1,
        body.pageSize ?? 20
    );

    if (isErr(result)) return resultToResponse(result);

    // Succès : recherche POST, pas d'en-tête de cache.
    return NextResponse.json(result.data);
}

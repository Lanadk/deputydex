import { NextResponse } from "next/server";
import { getDeputeLegislaturesUseCase } from "@/app/domains/deputes/use-cases/get-depute-legislatures.use-case";
import { prismaDeputeLegislaturesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-legislatures.repository";
import { isOk } from "@/app/_shared/result-pattern/result";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string }> }
): Promise<Response> {
    const { uid } = await params;
    try {
        const result = await getDeputeLegislaturesUseCase(prismaDeputeLegislaturesRepository, uid);
        if (isOk(result)) return NextResponse.json(result.data);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute legislatures" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import { getDeputeActivityUseCase } from "@/app/domains/deputes/use-cases/get-depute-activity.use-case";
import { prismaDeputeActivityRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-activity.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = await getDeputeActivityUseCase(
            prismaDeputeActivityRepository,
            uid,
            Number(legislature)
        );

        if (isOk(result)) return NextResponse.json(result.data);
        return NextResponse.json({ error: result.error }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute activity" }, { status: 500 });
    }
}

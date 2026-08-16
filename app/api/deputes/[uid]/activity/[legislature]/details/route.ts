import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import { getDeputeActivityDetailsUseCase } from "@/app/domains/deputes/use-cases/get-depute-activity-details.use-case";
import { prismaDeputeActivityDetailsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-activity-details.repository";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
        return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    try {
        const result = await cachedRead(
            () => getDeputeActivityDetailsUseCase(
                prismaDeputeActivityDetailsRepository,
                uid,
                Number(legislature),
                new Date(dateParam)
            ),
            ["depute-activity-details", uid, legislature, dateParam]
        );

        if (isOk(result)) return cachedJson(result.data);
        return NextResponse.json({ error: result.error }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute activity details" }, { status: 500 });
    }
}

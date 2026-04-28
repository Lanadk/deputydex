import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import {
    prismaGroupeActivityDetailsRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-activity-details.repository";
import {getGroupeActivityDetailsUseCase} from "@/app/domains/groupes/use-cases/get-groupe-activity-details.use-case";


export async function GET(
    req: Request,
    { params }: { params: Promise<{ code: string; legislature: string }> }
) {
    const { code, legislature } = await params;
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
        return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const date = new Date(dateParam);

    try {
        const result = await getGroupeActivityDetailsUseCase(
            prismaGroupeActivityDetailsRepository,
            code,
            Number(legislature),
            date!
        );

        if (isOk(result)) {
            return NextResponse.json(result.data);
        }

        return NextResponse.json({ error: result.error }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Failed to get activity details" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";

/*
export async function GET(
    req: Request,
    { params }: { params: Promise<{ code: string; legislature: string }> }
) {
    const { code, legislature } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    try {
        const result = await getGroupeActivityDetailsUseCase(
            prismaGroupesActivityRepository,
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

 */
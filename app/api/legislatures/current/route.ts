import { NextResponse } from "next/server";
import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";
import { isOk } from "@/app/_shared/result-pattern/result";


export async function GET(): Promise<Response> {
    try {
        const result = await getCurrentLegislatureUseCase(prismaLegislaturesRepository);

        if (isOk(result)) {
            return NextResponse.json(result.data);
        }

        if (result.error === "NOT_FOUND") {
            return NextResponse.json({ error: result.error }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to fetch current legislature" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch current legislature" }, { status: 500 });
    }
}
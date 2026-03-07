import {NextResponse} from "next/server";
import {getCurrentLegislatureUseCase} from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import {
    prismaLegislaturesRepository
} from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";

export async function GET() {
    try {
        const result = await getCurrentLegislatureUseCase(prismaLegislaturesRepository);

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch current legislature" }, { status: 500 });
    }
}
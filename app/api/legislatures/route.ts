import {getAllLegislaturesUseCase} from "@/app/domains/legislatures/use-cases/get-all-legislatures.use-case";
import {
    prismaLegislaturesRepository
} from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";
import {NextResponse} from "next/server";


export async function GET() {
    try {
        const result = await getAllLegislaturesUseCase(prismaLegislaturesRepository);

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Failed to fetch all legislatures" }), { status: 500 });
    }
}
import {getAllLegislaturesUseCase} from "@/app/domains/legislatures/use-cases/get-all-legislatures.use-case";
import {
    prismaLegislaturesRepository
} from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";
import {NextResponse} from "next/server";
import {isOk} from "@/app/_shared/result-pattern/result";
import {cachedJson, cachedRead} from "@/app/_shared/cache/cached-response";


export async function GET(): Promise<Response> {
    try {
        const result = await cachedRead(
            () => getAllLegislaturesUseCase(prismaLegislaturesRepository),
            ["legislatures-all"]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json({ error: "Failed to fetch all legislatures" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch all legislatures" }, { status: 500 });
    }
}
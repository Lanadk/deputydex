import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getGroupeLegislaturesUseCase} from "@/app/domains/groupes/use-cases/get-groupe-legislatures.use-case";
import {prismaGroupeLegislaturesRepository} from "@/app/infrastructure/groupes/repositories/prisma-groupe-legislatures.repository";
import {cachedJson, cachedRead} from "@/app/_shared/cache/cached-response";


export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string}> }
): Promise<Response> {
    const { code } = await params;

    try {
        const result = await cachedRead(
            () => getGroupeLegislaturesUseCase(prismaGroupeLegislaturesRepository, code),
            ["groupe-legislatures", code]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json(
            { error: "Failed to get groupe legislatures" },
            { status: 500 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Failed to get groupe legislatures" },
            { status: 500 }
        );
    }
}

import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getGroupeCohesionUseCase} from "@/app/domains/groupes/use-cases/get-groupe-cohesion.use-case";
import {
    prismaGroupeCohesionRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";
import {cachedJson, cachedRead} from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { legislature } = await params;
    const { code }  = await params;
    const legislatureNumber = Number(legislature);

    try {

        const result = await cachedRead(
            () => getGroupeCohesionUseCase(prismaGroupeCohesionRepository, code, legislatureNumber),
            ["groupe-cohesion", code, legislature]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json(
            { error: result.error },
            { status: 500 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Failed to get groupe cohesion" },
            { status: 500 }
        );
    }
}
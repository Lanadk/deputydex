import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getGroupeCohesionUseCase} from "@/app/domains/groupes/use-cases/get-groupe-cohesion.use-case";
import {
    prismaGroupeCohesionRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { legislature } = await params;
    const { code }  = await params;
    const legislatureNumber = Number(legislature);

    try {

        const result = await getGroupeCohesionUseCase(
            prismaGroupeCohesionRepository,
            code,
            legislatureNumber
        );

        if (isOk(result)) {
            return NextResponse.json(result.data);
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
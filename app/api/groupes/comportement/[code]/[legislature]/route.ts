import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getGroupeComportementUseCase} from "@/app/domains/groupes/use-cases/get-groupe-comportement.use-case";
import prismaGroupeComportementRepository
    from "@/app/infrastructure/groupes/repositories/prisma-groupe-comportement.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { legislature } = await params;
    const { code }  = await params;
    const legislatureNumber = Number(legislature);

    try {

        const result = await getGroupeComportementUseCase(
            prismaGroupeComportementRepository,
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
            { error: "Failed to get groupe comportement" },
            { status: 500 }
        );
    }
}
import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getGroupeInfosUseCase} from "@/app/domains/groupes/use-cases/get-groupe-infos.use-case";
import {prismaGroupeInfosRepository} from "@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository";


export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { legislature } = await params;
    const { code }  = await params;
    const legislatureNumber = Number(legislature);

    try {

        const result = await getGroupeInfosUseCase(
            prismaGroupeInfosRepository,
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
            { error: "Failed to get groupe infos" },
            { status: 500 }
        );
    }
}
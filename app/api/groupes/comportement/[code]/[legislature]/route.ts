import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getGroupeComportementUseCase} from "@/app/domains/groupes/use-cases/get-groupe-comportement.use-case";
import prismaGroupeComportementRepository
    from "@/app/infrastructure/groupes/repositories/prisma-groupe-comportement.repository";
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
            () => getGroupeComportementUseCase(prismaGroupeComportementRepository, code, legislatureNumber),
            ["groupe-comportement", code, legislature]
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
            { error: "Failed to get groupe comportement" },
            { status: 500 }
        );
    }
}
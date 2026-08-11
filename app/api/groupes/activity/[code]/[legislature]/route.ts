import { NextResponse } from "next/server";
import {isOk} from "@/app/_shared/result-pattern/result";
import {getGroupeActivityUseCase} from "@/app/domains/groupes/use-cases/get-groupe-activity.use-case";
import {
    prismaGroupeActivityRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-activity.repository";
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
            () => getGroupeActivityUseCase(prismaGroupeActivityRepository, code, legislatureNumber),
            ["groupe-activity", code, legislature]
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
            { error: "Failed to get groupes cards" },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import {isOk} from "@/app/_shared/result-pattern/result";
import {getGroupesActivityUseCase} from "@/app/domains/groupes/use-cases/get-groupes-activity.use-case";
import {
    prismaGroupeActivityRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-activity.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{code: string, legislature: string}> }
): Promise<Response> {
    const { legislature } = await params;
    const { code }  = await params;
    const legislatureNumber = Number(legislature);
    try {

        const result = await getGroupesActivityUseCase(
            prismaGroupeActivityRepository,
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
            { error: "Failed to get groupes cards" },
            { status: 500 }
        );
    }
}
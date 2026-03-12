import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getFicheDeputeUseCase} from "@/app/domains/acteurs/use-cases/get-fiche-depute.use-case";
import {prismaFicheDeputeRepository} from "@/app/infrastructure/acteurs/repositories/prisma-fiche-depute.repository";


export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await params;

    try {
        const result = await getFicheDeputeUseCase(prismaFicheDeputeRepository, id);

        if(isOk(result)) {
            return NextResponse.json(result.data);
        }

        if(result.error === "NOT_FOUND") {
            return NextResponse.json({error: result.error}, {status: 404});
        }

        return NextResponse.json({error: "Failed to get acteur"}, {status: 500});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: "Failed to get acteur"}, {status: 500});
    }
}
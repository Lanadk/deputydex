import {NextResponse} from "next/server";
import {getActeurByIdUseCase} from "@/app/domains/acteurs/use-cases/get-acteur-by-id.use-case";
import {prismaActeursRepository} from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";
import {isOk} from "@/app/_shared/result-pattern/result";


export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await params;
    try {
        const result = await getActeurByIdUseCase(prismaActeursRepository, id);

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
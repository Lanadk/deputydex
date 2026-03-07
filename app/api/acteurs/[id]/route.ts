import {NextResponse} from "next/server";
import {getActeurByIdUseCase} from "@/app/domains/acteurs/use-cases/get-acteur-by-id.use-case";
import {prismaActeursRepository} from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";


export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const result = await getActeurByIdUseCase(prismaActeursRepository, id);

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: "Failed to get acteur"}, {status: 500});
    }
}
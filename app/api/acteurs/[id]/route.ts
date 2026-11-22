import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {getActeurByIdUseCase} from "@/app/domains/acteurs/use-cases/get-acteur-by-id.use-case";
import {prismaActeursRepository} from "@/app/infrastructure/acteurs/repositories/prisma-acteurs.repository";


export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
    const { id } = await params;

    const result = await cachedResult(
        () => getActeurByIdUseCase(prismaActeursRepository, id),
        ["acteur-by-id", id]
    );

    return resultToResponse(result, { NOT_FOUND: "Acteur introuvable" });
}

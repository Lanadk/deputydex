import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {getLastUpdateUseCase} from "@/app/domains/datasets/use-cases/get-last-update.use-case";
import {prismaDataSetsRepository} from "@/app/infrastructure/datasets/repositories/prisma-datasets-repository";

export async function GET(): Promise<Response> {
    const result = await cachedResult(
        () => getLastUpdateUseCase(prismaDataSetsRepository),
        ["datasets-lastupdate"]
    );

    return resultToResponse(result, { NOT_FOUND: "Aucune date de mise à jour enregistrée" });
}

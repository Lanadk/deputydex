import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { ActeurMandatsCountDTO } from "@/app/domains/acteurs/dto/acteur-mandats-count.dto";
import { isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";

export async function getActeurMandatsCountUseCase(
    repository: IActeursStatsRepository,
    acteurUid: string
): Promise<Result<ActeurMandatsCountDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getMandatsCount(acteurUid));
    if (isErr(result)) return result;
    const count = result.data;

    return ok({ count });
}

import { IActeursStatsRepository } from "@/app/domains/acteurs/repositories/IActeursStatsRepository";
import { ActeurMandatsCountDTO } from "@/app/domains/acteurs/dto/acteur-mandats-count.dto";
import { ok, Result } from "@/app/_shared/result-pattern/result";

export async function getActeurMandatsCountUseCase(
    repository: IActeursStatsRepository,
    acteurUid: string
): Promise<Result<ActeurMandatsCountDTO, never>> {
    const count = await repository.getMandatsCount(acteurUid);
    return ok({ count });
}

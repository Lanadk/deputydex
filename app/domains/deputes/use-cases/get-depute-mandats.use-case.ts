import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeMandatRepository } from "@/app/domains/deputes/repositories/IDeputeMandatRepository";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { mapDeputeMandatsEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-mandat.mapper";

export async function getDeputeMandatsUseCase(
    repository: IDeputeMandatRepository,
    uid: string
): Promise<Result<DeputeMandatDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputeMandats(uid));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(mapDeputeMandatsEntitiesToDTOs(entities));
}

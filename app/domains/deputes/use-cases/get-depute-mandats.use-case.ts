import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeMandatRepository } from "@/app/domains/deputes/repositories/IDeputeMandatRepository";
import { DeputeMandatDTO } from "@/app/domains/deputes/dto/depute-mandat.dto";
import { mapDeputeMandatsEntitiesToDTOs } from "@/app/domains/deputes/mappers/depute-mandat.mapper";

export async function getDeputeMandatsUseCase(
    repository: IDeputeMandatRepository,
    uid: string
): Promise<Result<DeputeMandatDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputeMandats(uid);
        return ok(mapDeputeMandatsEntitiesToDTOs(entities));
    } catch {
        return err("ERROR");
    }
}

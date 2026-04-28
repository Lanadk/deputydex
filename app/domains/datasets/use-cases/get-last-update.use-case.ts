import {err, ok, Result} from "@/app/_shared/result-pattern/result";
import {IDataSetsRepository} from "@/app/domains/datasets/repositories/IDataSetsRepository";

export async function getLastUpdateUseCase(
    repository: IDataSetsRepository
): Promise<Result<Date, "ERROR">> {
    const entity = await repository.getLastUpdate();

    if (!entity) {
        return err("ERROR");
    }

    return ok(entity);
}
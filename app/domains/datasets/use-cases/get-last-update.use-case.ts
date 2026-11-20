import {err, isErr, ok, Result} from "@/app/_shared/result-pattern/result";
import {fromRepository} from "@/app/_shared/result-pattern/app-error";
import {IDataSetsRepository} from "@/app/domains/datasets/repositories/IDataSetsRepository";

export async function getLastUpdateUseCase(
    repository: IDataSetsRepository
): Promise<Result<Date, "NOT_FOUND" | "DB_ERROR">> {
    const result = await fromRepository(() => repository.getLastUpdate());
    if (isErr(result)) return result;
    const entity = result.data;

    // null : aucun import enregistré pour l'instant.
    if (!entity) {
        return err("NOT_FOUND");
    }

    return ok(entity);
}

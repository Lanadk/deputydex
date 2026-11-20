import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IDeputeListRepository } from "@/app/domains/deputes/repositories/IDeputeListRepository";
import { DeputeListItemDTO } from "@/app/domains/deputes/dto/depute-list-item.dto";
import { mapDeputeListItemEntityToDTO } from "@/app/domains/deputes/mappers/depute-list-item.mapper";

export async function getDeputesListUseCase(
    repository: IDeputeListRepository,
    legislature: number
): Promise<Result<DeputeListItemDTO[], "DB_ERROR">> {
    const result = await fromRepository(() => repository.getDeputesList(legislature));
    if (isErr(result)) return result;
    const entities = result.data;

    return ok(entities.map(mapDeputeListItemEntityToDTO));
}

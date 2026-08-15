import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IDeputeListRepository } from "@/app/domains/deputes/repositories/IDeputeListRepository";
import { DeputeListItemDTO } from "@/app/domains/deputes/dto/depute-list-item.dto";
import { mapDeputeListItemEntityToDTO } from "@/app/domains/deputes/mappers/depute-list-item.mapper";

export async function getDeputesListUseCase(
    repository: IDeputeListRepository,
    legislature: number
): Promise<Result<DeputeListItemDTO[], "ERROR">> {
    try {
        const entities = await repository.getDeputesList(legislature);
        return ok(entities.map(mapDeputeListItemEntityToDTO));
    } catch {
        return err("ERROR");
    }
}

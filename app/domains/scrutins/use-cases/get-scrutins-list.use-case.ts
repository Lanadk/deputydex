import { Result, ok, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IScrutinListRepository } from "@/app/domains/scrutins/repositories/IScrutinListRepository";
import { ScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { ScrutinListPageDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { mapScrutinListItemsEntitiesToDTOs } from "@/app/domains/scrutins/mappers/scrutin-list-item.mapper";

export async function getScrutinsListUseCase(
    repository: IScrutinListRepository,
    filters: ScrutinListFilters
): Promise<Result<ScrutinListPageDTO, "DB_ERROR">> {
    const result = await fromRepository(() => repository.getScrutinsPage(filters));
    if (isErr(result)) return result;
    const { rows, total } = result.data;

    return ok({
        items: mapScrutinListItemsEntitiesToDTOs(rows),
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
    });
}

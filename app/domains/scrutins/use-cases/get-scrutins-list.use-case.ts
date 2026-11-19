import { Result, ok, err } from "@/app/_shared/result-pattern/result";
import { IScrutinListRepository } from "@/app/domains/scrutins/repositories/IScrutinListRepository";
import { ScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { ScrutinListPageDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { mapScrutinListItemEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-list-item.mapper";

export async function getScrutinsListUseCase(
    repository: IScrutinListRepository,
    filters: ScrutinListFilters
): Promise<Result<ScrutinListPageDTO, "ERROR">> {
    try {
        const { rows, total } = await repository.getScrutinsPage(filters);
        return ok({
            items: rows.map(mapScrutinListItemEntityToDTO),
            total,
            page: filters.page,
            pageSize: filters.pageSize,
            pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
        });
    } catch (e) {
        console.error(e);
        return err("ERROR");
    }
}

import "server-only";

import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import { sanitizeFilterBarQuery } from "@/app/infrastructure/filtering/filter-bar-sanitize";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/domains/acteurs/filters/acteurs.filters";
import { mapActeursToDTO } from "@/app/domains/acteurs/mappers/acteur.mapper";
import {IActeursRepository} from "@/app/domains/acteurs/repositories/IActeursRepository";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {Result, ok} from "@/app/_shared/result-pattern/result"
import {PaginatedResult} from "@/app/_shared/pagination/paginated-result";

const SANITIZE_OPTIONS = {
    allowedFilterFields: ACTEURS_FILTER_FIELDS.map((f) => f.field),
    allowedSortFields: ACTEURS_SORT_OPTIONS.map((s) => s.field),
};

export async function searchActeursUseCase(
    repository: IActeursRepository,
    rawQuery: FilterBarQuery,
    page = 1,
    pageSize = 20
): Promise<Result<PaginatedResult<ActeurDTO>, never>> {
    const query = sanitizeFilterBarQuery(rawQuery, SANITIZE_OPTIONS);

    const { items, total } = await repository.search(query, page, pageSize);
    const dtoItems = mapActeursToDTO(items as any[]);

    return ok({
        items: dtoItems,
        total,
        page,
        pageSize,
        pageCount: Math.max(1, Math.ceil(total / pageSize)),
    });
}
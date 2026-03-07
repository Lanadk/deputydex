import type { PaginatedResult } from "@/app/_shared/pagination/paginated-result";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {FilterBarQuery} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar.types";

export interface ActeursGateway {
    search(
        query: FilterBarQuery,
        page?: number,
        pageSize?: number
    ): Promise<PaginatedResult<ActeurDTO>>;

    getById(id: string): Promise<ActeurDTO | null>;
}
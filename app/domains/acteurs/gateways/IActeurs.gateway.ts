import type { PaginatedResult } from "@/app/_shared/pagination/paginated-result";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";

export interface IActeursGateway {
    search(
        query: FilterBarQuery,
        page?: number,
        pageSize?: number
    ): Promise<PaginatedResult<ActeurDTO>>;

    getById(id: string): Promise<ActeurDTO | null>;
}
import type { PaginatedResult } from "@/app/_shared/pagination/paginated-result";
import {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";

export interface IActeursGateway {
    search(
        query: FilterBarQuery,
        page?: number,
        pageSize?: number
    ): Promise<PaginatedResult<ActeurDTO>>;

    getById(id: string): Promise<ActeurDTO | null>;

    //TODO export if necessary in the future
}
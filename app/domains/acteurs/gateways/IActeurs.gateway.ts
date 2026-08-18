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

    /** Députés ayant réellement eu un mandat, toutes législatures confondues (voir prisma-acteurs-stats.repository.ts). */
    searchDeputies(search?: string): Promise<ActeurDTO[]>;

    //TODO export if necessary in the future
}
import type { PaginatedResult } from "@/app/_shared/pagination/paginated-result";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {FilterBarQuery} from "@/app/_shared/filtering/filter-bar.types";
import {FicheDeputeDTO} from "@/app/domains/acteurs/dto/fiche-depute.dto";

export interface IActeursGateway {
    search(
        query: FilterBarQuery,
        page?: number,
        pageSize?: number
    ): Promise<PaginatedResult<ActeurDTO>>;

    getById(id: string): Promise<ActeurDTO | null>;

    getFicheDepute(id: string, legislature: number): Promise<FicheDeputeDTO | null>
    //TODO export if necessary in the future
}
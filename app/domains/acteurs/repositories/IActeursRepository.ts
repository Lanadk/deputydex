import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";
import {ActeurEntity} from "@/app/domains/acteurs/entities/acteurs.entity";

export interface IActeursRepository {
    search(
        query: FilterBarQuery,
        page: number,
        pageSize: number
    ): Promise<{
        items: ActeurEntity[];
        total: number;
    }>;

    getById(id: string): Promise<ActeurEntity | null>;

    findManyForExport(
        query: FilterBarQuery,
        maxRows: number
    ): Promise<ActeurEntity[]>;
}
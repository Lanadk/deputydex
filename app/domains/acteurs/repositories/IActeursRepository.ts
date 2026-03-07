import type { FilterBarQuery } from "@/app/_shared/filtering/filter-bar.types";

export interface IActeursRepository {
    search(
        query: FilterBarQuery,
        page: number,
        pageSize: number
    ): Promise<{
        items: unknown[];
        total: number;
    }>;

    findManyForExport(
        query: FilterBarQuery,
        maxRows: number
    ): Promise<unknown[]>;
}
import {FilterBarQuery} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar.types";

export type PaginatedResult<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
};

export type SearchBody = {
    query?: FilterBarQuery;
    page?: number;
    pageSize?: number;
};
export type PaginatedResult<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
};

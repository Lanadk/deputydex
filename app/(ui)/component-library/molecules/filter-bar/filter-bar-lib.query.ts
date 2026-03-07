import type { FilterBarQuery, SortDirection, SortOption, ActiveFieldFilter } from "@/app/_shared/filtering/filter-bar.types";

export function buildQuery(
    activeId: string | null,
    sortOptions: SortOption[],
    activeFieldFilters: Record<string, ActiveFieldFilter>
): FilterBarQuery {
    const orderBy: Record<string, SortDirection>[] = [];

    if (activeId) {
        const option = sortOptions.find((o) => o.id === activeId);
        if (option) orderBy.push({ [option.field]: option.direction });
    }

    const conditions = Object.entries(activeFieldFilters)
        .filter(([, f]) => f.value.trim() !== "")
        .map(([field, f]) => ({ [field]: { [f.operator]: f.value } }));

    const where =
        conditions.length === 0
            ? {}
            : conditions.length === 1
                ? conditions[0]
                : { AND: conditions };

    return { orderBy, where };
}
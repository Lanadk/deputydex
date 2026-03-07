import type { FilterBarQuery } from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar.types";

type AnyRow = Record<string, any>;

function getFirstOrderBy(orderBy: FilterBarQuery["orderBy"]) {
    if (!Array.isArray(orderBy) || orderBy.length === 0) return null;
    const rule = orderBy[0];
    const field = Object.keys(rule ?? {})[0];
    if (!field) return null;
    const dir = (rule as any)[field];
    if (dir !== "asc" && dir !== "desc") return null;
    return { field, dir } as const;
}

function extractConditions(where: FilterBarQuery["where"]) {
    if (!where || typeof where !== "object") return [];

    const w: any = where;
    const and = Array.isArray(w.AND) ? w.AND : [w];

    return and
        .map((cond: any) => {
            const field = cond && typeof cond === "object" ? Object.keys(cond)[0] : null;
            if (!field) return null;

            const opObj = cond[field];
            if (!opObj || typeof opObj !== "object") return null;

            const operator = Object.keys(opObj)[0];
            const value = opObj[operator];

            return { field, operator, value };
        })
        .filter(Boolean) as { field: string; operator: string; value: any }[];
}

function match(rowValue: any, operator: string, filterValue: any) {
    if (filterValue === undefined || filterValue === null) return true;

    // Normalisation string (simple)
    const a = rowValue ?? "";
    const b = filterValue ?? "";

    const as = String(a).toLowerCase();
    const bs = String(b).toLowerCase();

    switch (operator) {
        case "contains":
            return as.includes(bs);
        case "startsWith":
            return as.startsWith(bs);
        case "endsWith":
            return as.endsWith(bs);
        case "equals":
            return String(a) === String(b);
        case "gte":
            return String(a) >= String(b);
        case "lte":
            return String(a) <= String(b);
        default:
            return true;
    }
}

export function applyFilterBarQueryClient<T extends AnyRow>(rows: T[], query: FilterBarQuery): T[] {
    const conditions = extractConditions(query.where);

    let out = rows;

    // filter
    if (conditions.length > 0) {
        out = out.filter((row) => {
            return conditions.every(({ field, operator, value }) => match((row as any)[field], operator, value));
        });
    }

    // sort (1 regle max)
    const sortRule = getFirstOrderBy(query.orderBy);
    if (sortRule) {
        const { field, dir } = sortRule;
        const factor = dir === "asc" ? 1 : -1;

        out = [...out].sort((ra, rb) => {
            const a = (ra as any)[field];
            const b = (rb as any)[field];

            // strings / numbers / null
            if (a == null && b == null) return 0;
            if (a == null) return 1;
            if (b == null) return -1;

            if (typeof a === "number" && typeof b === "number") return (a - b) * factor;

            return String(a).localeCompare(String(b), undefined, { sensitivity: "base" }) * factor;
        });
    }

    return out;
}
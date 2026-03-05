// app/lib/utils/filterbar-sanitize.ts
import type { FilterBarQuery } from "@/app/component-library/molecules/filter-bar/filter-bar.types";

const DEFAULT_ALLOWED_OPERATORS = new Set([
    "contains",
    "startsWith",
    "endsWith",
    "equals",
    "gte",
    "lte",
]);

function isNonEmptyObject(v: unknown): v is Record<string, any> {
    return !!v && typeof v === "object" && !Array.isArray(v);
}

export type SanitizeFilterBarOptions = {
    allowedFilterFields: string[];
    allowedSortFields: string[];
    allowedOperators?: string[]; // optionnel
};

/**
 * Sanitize un FilterBarQuery pour un usage serveur (Prisma):
 * - whitelist champs
 * - whitelist opérateurs
 * - ignore tout ce qui n'est pas autorisé
 */
export function sanitizeFilterBarQuery(
    query: FilterBarQuery,
    opts: SanitizeFilterBarOptions
): FilterBarQuery {
    const allowedFilterFields = new Set(opts.allowedFilterFields);
    const allowedSortFields = new Set(opts.allowedSortFields);
    const allowedOperators = opts.allowedOperators
        ? new Set(opts.allowedOperators)
        : DEFAULT_ALLOWED_OPERATORS;

    const orderBy = sanitizeOrderBy(query.orderBy, allowedSortFields);
    const where = sanitizeWhere(query.where, allowedFilterFields, allowedOperators);

    return { orderBy, where };
}

function sanitizeOrderBy(
    orderBy: FilterBarQuery["orderBy"],
    allowedSortFields: Set<string>
) {
    if (!Array.isArray(orderBy)) return [];

    return orderBy
        .map((rule) => {
            if (!isNonEmptyObject(rule)) return null;

            const field = Object.keys(rule)[0];
            const dir = (rule as any)[field];

            if (!allowedSortFields.has(field)) return null;
            if (dir !== "asc" && dir !== "desc") return null;

            return { [field]: dir };
        })
        .filter(Boolean) as Record<string, "asc" | "desc">[];
}

function sanitizeWhere(
    where: FilterBarQuery["where"],
    allowedFilterFields: Set<string>,
    allowedOperators: Set<string>
) {
    if (!isNonEmptyObject(where) || Object.keys(where).length === 0) return {};

    const and = (where as any).AND;
    const conditions: any[] = Array.isArray(and) ? and : [where];

    const sanitized = conditions
        .map((cond) => {
            if (!isNonEmptyObject(cond)) return null;

            const field = Object.keys(cond)[0];
            const opObj = (cond as any)[field];

            if (!allowedFilterFields.has(field)) return null;
            if (!isNonEmptyObject(opObj)) return null;

            const operator = Object.keys(opObj)[0];
            const value = opObj[operator];

            if (!allowedOperators.has(operator)) return null;

            return { [field]: { [operator]: value } };
        })
        .filter(Boolean) as any[];

    if (sanitized.length === 0) return {};
    if (sanitized.length === 1) return sanitized[0];
    return { AND: sanitized };
}
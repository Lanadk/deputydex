import type { FilterField } from "@/app/_shared/filtering/filter-bar.types";

export const OPERATORS: Record<
    FilterField["type"],
    { value: string; label: string }[]
> = {
    string: [
        { value: "contains", label: "contient" },
        { value: "startsWith", label: "commence par" },
        { value: "endsWith", label: "finit par" },
        { value: "equals", label: "égal à" },
    ],
    date: [
        { value: "equals", label: "égal à" },
        { value: "gte", label: "après le" },
        { value: "lte", label: "avant le" },
    ],
    number: [
        { value: "equals", label: "égal à" },
        { value: "gte", label: "supérieur à" },
        { value: "lte", label: "inférieur à" },
    ],
    enum: [{ value: "equals", label: "égal à" }],
    select: [{ value: "equals", label: "égal à" }],
};
import type { FilterBarQuery } from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar.types";
import type { ActeurDTO } from "@/app/lib/dto/acteur.dto";
import {PaginatedResult} from "@/app/_shared/pagination/paginated-result";

export async function searchActeurs(
    query: FilterBarQuery,
    page = 1,
    pageSize = 20
): Promise<PaginatedResult<ActeurDTO>> {
    const res = await fetch("/api/acteurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page, pageSize }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to search acteurs (${res.status}): ${text}`);
    }

    return res.json();
}
import { ScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { ScrutinListPageEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";

export interface IScrutinListRepository {
    /** Une page de scrutins filtrés, du plus récent au plus ancien, et le total correspondant aux filtres. */
    getScrutinsPage(filters: ScrutinListFilters): Promise<ScrutinListPageEntity>;
}

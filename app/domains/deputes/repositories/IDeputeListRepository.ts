import { DeputeListItemEntity } from "@/app/domains/deputes/entities/depute-list-item.entity";

export interface IDeputeListRepository {
    getDeputesList(legislature: number): Promise<DeputeListItemEntity[]>;
}

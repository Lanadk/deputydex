import { DeputeActivityDetailsEntity } from "@/app/domains/deputes/entities/depute-activity-details.entity";

export interface IDeputeActivityDetailsRepository {
    getDeputeActivityDetails(
        uid: string,
        legislature: number,
        date: Date
    ): Promise<DeputeActivityDetailsEntity[]>;
}

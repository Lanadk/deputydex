import { DeputeActivityEntity } from "@/app/domains/deputes/entities/depute-activity.entity";

export interface IDeputeActivityRepository {
    getDeputeActivity(uid: string, legislature: number): Promise<DeputeActivityEntity[]>;
}

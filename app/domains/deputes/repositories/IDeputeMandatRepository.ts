import { DeputeMandatEntity } from "@/app/domains/deputes/entities/depute-mandat.entity";

export interface IDeputeMandatRepository {
    getDeputeMandats(uid: string): Promise<DeputeMandatEntity[]>;
}

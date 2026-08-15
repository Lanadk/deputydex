import { DeputeLegislatureEntity } from "@/app/domains/deputes/entities/depute-legislatures.entity";

export interface IDeputeLegislaturesRepository {
    getDeputeLegislatures(uid: string): Promise<DeputeLegislatureEntity[]>;
}

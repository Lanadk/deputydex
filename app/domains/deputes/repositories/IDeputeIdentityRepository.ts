import { DeputeIdentityEntity } from "@/app/domains/deputes/entities/depute-identity.entity";

export interface IDeputeIdentityRepository {
    getDeputeIdentity(uid: string, legislature: number): Promise<DeputeIdentityEntity | null>;
}

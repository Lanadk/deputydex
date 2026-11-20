import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";
import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";

export interface IDeputeDossiersRepository {
    getDeputeDossierContributions(uid: string, legislature: number): Promise<DeputeDossierContributionEntity[]>;
    getDeputeDossierAmendements(uid: string, legislature: number, dossierUid: string): Promise<DeputeDossierAmendementEntity[]>;
}
